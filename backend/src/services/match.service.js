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
                LISTAGG(h.nombre, ', ') WITHIN GROUP (ORDER BY h.nombre) AS habilidades
             FROM usuario_habilidades uh_busca
             JOIN usuario_habilidades uh_ofrece 
                ON uh_busca.habilidad_id = uh_ofrece.habilidad_id
             JOIN habilidades h 
                ON uh_ofrece.habilidad_id = h.id
             JOIN usuarios u 
                ON uh_ofrece.usuario_id = u.id
             WHERE uh_busca.usuario_id = :userId
             AND uh_busca.tipo = 'Busca'
             AND uh_ofrece.tipo = 'Ofrece'
             AND uh_ofrece.usuario_id != :userId
             GROUP BY u.id, u.nombre, u.apellido, u.alias`,
            { userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows.map(row => ({
            id: row.ID,
            nombre: row.NOMBRE,
            apellido: row.APELLIDO,
            alias: row.ALIAS,
            habilidades: row.HABILIDADES
                ? row.HABILIDADES.split(',').map(h => h.trim())
                : []
        }));

    } finally {
        if (connection) await connection.close();
    }
};

module.exports = { getMatches };