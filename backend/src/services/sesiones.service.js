const db = require('../db');

const getSesiones = async (userId) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT se.id, se.fecha_programada, se.estado_id,
              h.nombre AS habilidad,
              u1.nombre AS solicitante,
              u2.nombre AS receptor
       FROM sesiones se
       JOIN solicitudes so ON so.id = se.solicitud_id
       JOIN habilidades h  ON h.id = so.habilidad_id
       JOIN usuarios u1    ON u1.id = so.solicitante_id
       JOIN usuarios u2    ON u2.id = so.receptor_id
       WHERE (so.solicitante_id = :id OR so.receptor_id = :id)
       AND se.estado_id = 4
       ORDER BY se.fecha_programada ASC`,
      { id: userId },
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows.map(row => ({
      id: row.ID,
      fecha_programada: row.FECHA_PROGRAMADA,
      estado_id: row.ESTADO_ID,
      habilidad: row.HABILIDAD,
      solicitante: row.SOLICITANTE,
      receptor: row.RECEPTOR,
    }));

  } finally {
    if (connection) await connection.close();
  }
};

const finalizarSesion = async (sesionId, userId) => {
  let connection;
  try {
    connection = await db.getConnection();

    // obtener sesión con datos de solicitud
    const result = await connection.execute(
      `SELECT se.estado_id, so.solicitante_id, so.receptor_id
       FROM sesiones se
       JOIN solicitudes so ON so.id = se.solicitud_id
       WHERE se.id = :id`,
      { id: sesionId },
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) throw new Error('Sesión no encontrada');

    const sesion = result.rows[0];

    // validar que sea participante
    if (sesion.SOLICITANTE_ID !== userId && sesion.RECEPTOR_ID !== userId) {
      throw new Error('No autorizado');
    }

    if (sesion.ESTADO_ID !== 4) throw new Error('La sesión ya fue procesada');

    // validar saldo del solicitante
    const saldoResult = await connection.execute(
      `SELECT saldo_tokens FROM usuarios WHERE id = :id`,
      { id: sesion.SOLICITANTE_ID },
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );

    const saldo = saldoResult.rows[0].SALDO_TOKENS;
    if (saldo < 10) throw new Error('El solicitante no tiene saldo suficiente');

    // descontar tokens al solicitante
    await connection.execute(
      `UPDATE usuarios SET saldo_tokens = saldo_tokens - 10 WHERE id = :id`,
      { id: sesion.SOLICITANTE_ID }
    );

    // acreditar tokens al receptor
    await connection.execute(
      `UPDATE usuarios SET saldo_tokens = saldo_tokens + 10 WHERE id = :id`,
      { id: sesion.RECEPTOR_ID }
    );

    // actualizar estado sesión a Completada
    await connection.execute(
      `UPDATE sesiones SET estado_id = 5 WHERE id = :id`,
      { id: sesionId }
    );

    await connection.commit();
    return { message: 'Sesión finalizada y tokens transferidos' };

  } catch (error) {
    if (connection) await connection.rollback();
    throw error;
  } finally {
    if (connection) await connection.close();
  }
};

const cancelarSesion = async (sesionId, userId) => {
  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT se.estado_id, so.solicitante_id, so.receptor_id
       FROM sesiones se
       JOIN solicitudes so ON so.id = se.solicitud_id
       WHERE se.id = :id`,
      { id: sesionId },
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) throw new Error('Sesión no encontrada');

    const sesion = result.rows[0];

    if (sesion.SOLICITANTE_ID !== userId && sesion.RECEPTOR_ID !== userId) {
      throw new Error('No autorizado');
    }

    if (sesion.ESTADO_ID !== 4) throw new Error('La sesión ya fue procesada');

    await connection.execute(
      `UPDATE sesiones SET estado_id = 6 WHERE id = :id`,
      { id: sesionId }
    );

    await connection.commit();
    return { message: 'Sesión cancelada' };

  } finally {
    if (connection) await connection.close();
  }
};

module.exports = { getSesiones, finalizarSesion, cancelarSesion };