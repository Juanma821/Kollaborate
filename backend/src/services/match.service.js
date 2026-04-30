const db = require('../db');

const getMatches = async (userId, categoria = null) => {
    let connection;
    try {
        connection = await db.getConnection();

        const query = `
            SELECT 
                u.id,
                u.nombre,
                u.apellido,
                u.alias,
                LISTAGG(h.nombre, ', ') WITHIN GROUP (ORDER BY h.nombre) AS habilidades,
                LISTAGG(h.categoria, ', ') WITHIN GROUP (ORDER BY h.nombre) AS categorias
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
            ${categoria ? `AND LOWER(h.categoria) = LOWER(:categoria)` : ''}
            GROUP BY u.id, u.nombre, u.apellido, u.alias
        `;

        const binds = categoria ? { userId, categoria } : { userId };

        const result = await connection.execute(query, binds, {
            outFormat: db.oracledb.OUT_FORMAT_OBJECT
        });

        return result.rows.map(row => ({
            id: row.ID,
            nombre: row.NOMBRE,
            apellido: row.APELLIDO,
            alias: row.ALIAS,
            habilidades: row.HABILIDADES
                ? row.HABILIDADES.split(',').map(h => h.trim())
                : [],
            categorias: row.CATEGORIAS
                ? row.CATEGORIAS.split(',').map(c => c.trim())
                : []
        }));
    } finally {
        if (connection) await connection.close();
    }
};

const getMatchProfileById = async (userId) => {
    let connection;
    try {
        connection = await db.getConnection();
        const userResult = await connection.execute(
            `SELECT 
                u.id AS "id",
                u.nombre AS "nombre",
                u.apellido AS "apellido",
                u.alias AS "alias",
                u.reputacion_promedio AS "reputacion",
                u.rol AS "rol",
                i.nombre AS "institucion_nombre"
             FROM usuarios u
             LEFT JOIN instituciones i ON i.id = u.institucion_id
             WHERE u.id = :id`,
            { id: userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        const user = userResult.rows[0];
        if (!user) return null;

        const skillsResult = await connection.execute(
            `SELECT h.id AS "id", h.nombre AS "nombre", uh.tipo AS "tipo"
             FROM usuario_habilidades uh
             JOIN habilidades h ON h.id = uh.habilidad_id
             WHERE uh.usuario_id = :id`,
            { id: userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        return {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            alias: user.alias,
            reputacion: user.reputacion || 0,
            rol: user.rol,
            institucion_nombre: user.institucion_nombre || null,
            ofrezco: skillsResult.rows
                .filter((row) => row.tipo === 'Ofrece')
                .map((row) => ({ id: row.id, nombre: row.nombre })),
            busco: skillsResult.rows
                .filter((row) => row.tipo === 'Busca')
                .map((row) => ({ id: row.id, nombre: row.nombre }))
        };

    } catch (error) {
        console.error("Error en getMatchProfileById:", error.message);
        throw error; 
    } finally {
        if (connection) await connection.close();
    }
};

module.exports = { getMatches, getMatchProfileById };
