const db = require('../db');

// Obtener historial de mensajes de una sesión
const getMensajesBySesion = async (sesionId) => {
    let connection;
    try {
        connection = await db.getConnection();
        const result = await connection.execute(
            `SELECT id AS "id", 
                    emisor_id AS "emisor_id", 
                    contenido AS "text", 
                    TO_CHAR(fecha_envio, 'YYYY-MM-DD"T"HH24:MI:SS') AS "created_at"
             FROM mensajes 
             WHERE sesion_id = :sesionId 
             ORDER BY fecha_envio ASC`,
            { sesionId: Number(sesionId) },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } catch (error) {
        console.error("Error en getMensajesBySesion:", error);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

// Guardar un nuevo mensaje
const enviarMensaje = async (sesionId, emisorId, contenido) => {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.execute(
            `INSERT INTO mensajes (sesion_id, emisor_id, contenido) 
             VALUES (:sesion, :emisor, :texto)`,
            { sesion: sesionId, emisor: emisorId, texto: contenido }
        );
        await connection.commit();
        return { success: true };
    } finally {
        if (connection) await connection.close();
    }
};

module.exports = { getMensajesBySesion, enviarMensaje };