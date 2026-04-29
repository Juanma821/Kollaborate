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
       WHERE so.solicitante_id = :id OR so.receptor_id = :id
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

module.exports = { getSesiones };