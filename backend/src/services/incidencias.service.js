const db = require('../db');

const crearIncidencia = async (sesionId, usuarioReportaId, tipo, descripcion, prioridad = 'Media') => {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.execute(
            `INSERT INTO INCIDENCIAS (
                sesion_id, 
                usuario_reporta_id, 
                tipo_incidencia, 
                descripcion, 
                prioridad
            ) VALUES (:s, :u, :t, :d, :p)`,
            { 
                s: Number(sesionId), 
                u: usuarioReportaId, 
                t: tipo, 
                d: descripcion, 
                p: prioridad 
            }
        );
        await connection.commit();
        return { success: true };
    } finally {
        if (connection) await connection.close();
    }
};

module.exports = { crearIncidencia };