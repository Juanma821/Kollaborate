const db = require('../db');

const getMatches = async (userId) => {
    let connection;

    try {
        connection = await db.getConnection();

        const result = await connection.execute(
            `SELECT 
                u.id,
                u.nombre,
                u.apellido,
                u.alias,
                h.nombre AS habilidad
             FROM usuario_habilidades uh_busca
             JOIN habilidades h ON uh_busca.habilidad_id = h.id

             JOIN usuario_habilidades uh_ofrece 
                ON uh_busca.habilidad_id = uh_ofrece.habilidad_id

             JOIN usuarios u ON uh_ofrece.usuario_id = u.id

             WHERE uh_busca.usuario_id = :userId
             AND uh_busca.tipo = 'Busca'
             AND uh_ofrece.tipo = 'Ofrece'
             AND uh_ofrece.usuario_id != :userId`,
            { userId }
        );

        return result.rows.map(row => ({
            id: row.ID,
            nombre: row.NOMBRE,
            apellido: row.APELLIDO,
            alias: row.ALIAS,
            habilidad: row.HABILIDAD
        }));

    } finally {
        if (connection) await connection.close();
    }
};

module.exports = { getMatches };