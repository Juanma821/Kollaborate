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

const getMatchProfileById = async (userId) => {
    let connection;

    try {
        connection = await db.getConnection();

        const userResult = await connection.execute(
            `SELECT 
                u.id,
                u.nombre,
                u.apellido,
                u.alias,
                u.reputacion_promedio,
                u.rol,
                i.nombre AS institucion_nombre
             FROM usuarios u
             LEFT JOIN instituciones i ON i.id = u.institucion_id
             WHERE u.id = :id`,
            { id: userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        const user = userResult.rows[0];
        if (!user) return null;

        const skillsResult = await connection.execute(
            `SELECT h.id, h.nombre, uh.tipo
             FROM usuario_habilidades uh
             JOIN habilidades h ON h.id = uh.habilidad_id
             WHERE uh.usuario_id = :id`,
            { id: userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        return {
            id: user.ID,
            nombre: user.NOMBRE,
            apellido: user.APELLIDO,
            alias: user.ALIAS,
            reputacion: user.REPUTACION_PROMEDIO || 0,
            rol: user.ROL,
            institucion_nombre: user.INSTITUCION_NOMBRE || null,
            ofrezco: skillsResult.rows
                .filter((row) => row.TIPO === 'Ofrece')
                .map((row) => ({ id: row.ID, nombre: row.NOMBRE })),
            busco: skillsResult.rows
                .filter((row) => row.TIPO === 'Busca')
                .map((row) => ({ id: row.ID, nombre: row.NOMBRE }))
        };

    } finally {
        if (connection) await connection.close();
    }
};


module.exports = { getMatches, getMatchProfileById };
