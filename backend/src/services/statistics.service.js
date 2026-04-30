const db = require('../db');

const getUserStatistics = async (userId) => {
    let connection;
    try {
        connection = await db.getConnection();

        // 1. Resumen: Reputación, Tokens y Rango (Nivel)
        const resumen = await connection.execute(
            `SELECT u.reputacion_promedio AS "reputacion", 
                    u.saldo_tokens AS "tokens", 
                    nr.nombre_nivel AS "rango",
                    nr.color_hex AS "rango_color"
             FROM USUARIOS u
             LEFT JOIN NIVELES_REPUTACION nr ON u.nivel_id = nr.id
             WHERE u.id = :userId`,
            { userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        // 2. Balance: Aprendizaje (como solicitante) vs Enseñanza (como receptor)
        const balance = await connection.execute(
            `SELECT 
                (SELECT COUNT(*) FROM SOLICITUDES WHERE solicitante_id = :userId AND estado_id = 2) AS "aprendizaje",
                (SELECT COUNT(*) FROM SOLICITUDES WHERE receptor_id = :userId AND estado_id = 2) AS "ensenanza"
             FROM DUAL`,
            { userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        // 3. Historial de Tokens: Movimientos reales de la tabla TRANSACCIONES
        // Obtenemos los últimos 7 días de actividad
        const historial = await connection.execute(
            `SELECT TO_CHAR(fecha, 'DD/MM') AS "label", 
                    monto AS "valor"
             FROM TRANSACCIONES
             WHERE emisor_id = :userId OR receptor_id = :userId
             ORDER BY fecha ASC
             FETCH FIRST 7 ROWS ONLY`,
            { userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        return {
            resumen: resumen.rows[0] || null,
            balance: balance.rows[0] || { aprendizaje: 0, ensenanza: 0 },
            historial: historial.rows || []
        };

    } catch (error) {
        console.error("❌ Error SQL en Statistics Service:", error.message);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

module.exports = { getUserStatistics };