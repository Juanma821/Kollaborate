const db = require('../db');

const getTokenData = async (userId, filter) => {
    let connection;
    try {
        connection = await db.getConnection();

        const userRes = await connection.execute(
            `SELECT saldo_tokens FROM USUARIOS WHERE id = :userId`,
            [userId]
        );
        const balance = userRes.rows[0]?.SALDO_TOKENS || 0;

        let sql = "";
        if (filter === 'received') {
            sql = `
                SELECT 
                    s.id AS "id",
                    'Pago por tutoría: ' || h.nombre AS "description",
                    '+' || s.tokens_recompensa AS "amount",
                    TO_CHAR(s.fecha_creacion, 'DD-MM-YYYY') AS "date"
                FROM SOLICITUDES s
                JOIN HABILIDADES h ON s.habilidad_id = h.id
                WHERE s.receptor_id = :userId 
                AND s.estado_id = 3 -- IMPORTANTE: Solo mostramos las completadas/finalizadas
                ORDER BY s.fecha_creacion DESC`;
        } else {
            sql = `
                SELECT 
                    s.id AS "id",
                    'Pago a mentor: ' || h.nombre AS "description",
                    '-' || s.tokens_recompensa AS "amount",
                    TO_CHAR(s.fecha_creacion, 'DD-MM-YYYY') AS "date"
                FROM SOLICITUDES s
                JOIN HABILIDADES h ON s.habilidad_id = h.id
                WHERE s.solicitante_id = :userId 
                AND s.estado_id = 3 -- IMPORTANTE: Solo mostramos las completadas/finalizadas
                ORDER BY s.fecha_creacion DESC`;
        }

        const historyRes = await connection.execute(sql, [userId]);

        return {
            balance,
            history: historyRes.rows
        };

    } catch (error) {
        console.error("❌ Error en TokenService:", error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

module.exports = { getTokenData };