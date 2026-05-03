const db = require('../db');

const getHistory = async (userId, filter) => {
    let connection;
    let dateCondition = "";

    if (filter === 'day') {
        dateCondition = "AND TRUNC(s.fecha_programada) = TRUNC(SYSDATE)";
    } else if (filter === 'month') {
        dateCondition = "AND s.fecha_programada >= TRUNC(SYSDATE, 'MM')";
    } else if (filter === 'year') {
        dateCondition = "AND s.fecha_programada >= TRUNC(SYSDATE, 'YYYY')";
    }

    const sql = `
        SELECT 
            s.id AS "id",
            h.nombre AS "description", 
            TO_CHAR(s.fecha_programada, 'DD-MM-YYYY HH24:MI') AS "date",
            CASE 
                WHEN sol.solicitante_id = :userId THEN 'Aprendizaje'
                ELSE 'Enseñanza'
            END AS "type"
        FROM SESIONES s
        JOIN SOLICITUDES sol ON s.solicitud_id = sol.id
        JOIN HABILIDADES h ON sol.habilidad_id = h.id
        WHERE (sol.solicitante_id = :userId OR sol.receptor_id = :userId)
        ${dateCondition}
        ORDER BY s.fecha_programada DESC
    `;

    try {
        connection = await db.getConnection();
        const result = await connection.execute(sql, [userId, userId]);

        return result.rows;

    } catch (error) {
        console.error("❌ Error en RecordService.getHistory:", error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("❌ Error cerrando conexión:", err);
            }
        }
    }
};

module.exports = {
    getHistory
};