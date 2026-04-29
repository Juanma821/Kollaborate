const db = require('../db');

//  Crear solicitud
const createSolicitud = async (data) => {
    let connection;

    try {
        connection = await db.getConnection();

        // validar receptor
        const user = await connection.execute(
            `SELECT id FROM usuarios WHERE id = :id`,
            { id: data.receptor_id }
        );

        if (user.rows.length === 0) {
            throw new Error('Usuario receptor no existe');
        }

        // evitar auto solicitud
        if (data.solicitante_id === data.receptor_id) {
            throw new Error('No puedes enviarte solicitud a ti mismo');
        }

        // evitar duplicados
        const existing = await connection.execute(
            `SELECT id FROM solicitudes 
             WHERE solicitante_id = :s AND receptor_id = :r AND estado_id = 1`,
            {
                s: data.solicitante_id,
                r: data.receptor_id
            }
        );

        if (existing.rows.length > 0) {
            throw new Error('Ya existe una solicitud pendiente');
        }

        // insertar (estado 1 = Pendiente)
        const result = await connection.execute(
            `INSERT INTO solicitudes (solicitante_id, receptor_id, habilidad_id, estado_id)
             VALUES (:s, :r, :h, 1)
             RETURNING id INTO :id`,
            {
                s: data.solicitante_id,
                r: data.receptor_id,
                h: data.habilidad_id,
                id: { dir: db.oracledb.BIND_OUT, type: db.oracledb.NUMBER }
            }
        );

        await connection.commit();

        return {
            id: result.outBinds.id[0],
            message: 'Solicitud enviada'
        };

    } finally {
        if (connection) await connection.close();
    }
};

//  Obtener solicitudes (recibidas)
const getSolicitudes = async (userId) => {
  let connection;
  try {
    connection = await db.getConnection();

    const recibidas = await connection.execute(
      `SELECT s.id, u.nombre AS usuario, h.nombre AS habilidad, s.estado_id 
       FROM solicitudes s
       JOIN usuarios u ON u.id = s.solicitante_id
       JOIN habilidades h ON h.id = s.habilidad_id
       WHERE s.receptor_id = :id`,
      { id: userId },
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );

    const enviadas = await connection.execute(
      `SELECT s.id, u.nombre AS usuario, h.nombre AS habilidad, s.estado_id 
       FROM solicitudes s
       JOIN usuarios u ON u.id = s.receptor_id
       JOIN habilidades h ON h.id = s.habilidad_id
       WHERE s.solicitante_id = :id`,
      { id: userId },
      { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('RAW recibidas:', JSON.stringify(recibidas.rows));
    console.log('RAW enviadas:', JSON.stringify(enviadas.rows));
    console.log('userId usado:', userId);

    const mapRow = (row) => ({
        id: row.ID,
        usuario: row.USUARIO,
        habilidad: row.HABILIDAD,
        estado_id: row.ESTADO_ID,
        fecha_solicitud: row.FECHA_SOLICITUD,
    });

    return {
      recibidas: recibidas.rows.map(mapRow),
      enviadas: enviadas.rows.map(mapRow),
    };

  } finally {
    if (connection) await connection.close();
  }
};

const aceptarSolicitud = async (id, userId) => {
    let connection;

    try {
        connection = await db.getConnection();

        //  obtener solicitud
        const result = await connection.execute(
            `SELECT solicitante_id, receptor_id, habilidad_id, estado_id
             FROM solicitudes
             WHERE id = :id`,
            { id }
        );

        if (result.rows.length === 0) {
            throw new Error('Solicitud no existe');
        }

        const s = result.rows[0];

        //  validar receptor
        if (s.RECEPTOR_ID !== userId) {
            throw new Error('No autorizado');
        }

        //  evitar reprocesar
        if (s.ESTADO_ID !== 1) {
            throw new Error('La solicitud ya fue procesada');
        }

        console.log('✔ Solicitud válida, actualizando...');

        //  actualizar estado
        await connection.execute(
            `UPDATE solicitudes SET estado_id = 2 WHERE id = :id`,
            { id }
        );

        console.log('✔ Estado actualizado, creando sesión...');

        //  crear sesión
       await connection.execute(
            `INSERT INTO sesiones (
                solicitud_id,
                fecha_programada,
                estado_id
            ) VALUES (
                :solicitud,
                CURRENT_TIMESTAMP,
                4
            )`,
            {
                solicitud: id
            }
);

        console.log('✔ SESION INSERTADA');

        await connection.commit();

        return { message: 'Solicitud aceptada y sesión creada' };

    } catch (error) {
        console.error(' ERROR EN aceptarSolicitud:', error.message);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

//  Rechazar solicitud
const rechazarSolicitud = async (id, userId) => {
    let connection;

    try {
        connection = await db.getConnection();

        const result = await connection.execute(
            `SELECT estado_id FROM solicitudes WHERE id = :id AND receptor_id = :userId`,
            { id, userId }
        );

        if (result.rows.length === 0) {
            throw new Error('Solicitud no encontrada o no autorizada');
        }

        const solicitud = result.rows[0];

        if (solicitud.ESTADO_ID !== 1) {
            throw new Error('La solicitud ya fue procesada');
        }

        await connection.execute(
            `UPDATE solicitudes SET estado_id = 3 WHERE id = :id AND receptor_id = :user`,
            {
                id,
                user: userId
            }
        );

        await connection.commit();

        return { message: 'Solicitud rechazada' };

    } finally {
        if (connection) await connection.close();
    }
};

module.exports = {
    createSolicitud,
    getSolicitudes,
    aceptarSolicitud,
    rechazarSolicitud
};