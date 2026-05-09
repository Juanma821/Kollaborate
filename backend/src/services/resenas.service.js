const db = require('../db');

const crearResena = async (data) => {
    let connection;
    try {
        connection = await db.getConnection();

        // Verificar que la sesión existe y está completada (estado_id = 5)
        const sesion = await connection.execute(
            `SELECT se.id, se.estado_id, so.solicitante_id, so.receptor_id
             FROM sesiones se
             JOIN solicitudes so ON so.id = se.solicitud_id
             WHERE se.id = :id`,
            { id: data.sesion_id },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        if (sesion.rows.length === 0) throw new Error('Sesión no encontrada');

        const s = sesion.rows[0];

        if (s.ESTADO_ID !== 5) throw new Error('Solo puedes reseñar sesiones completadas');

        // Verificar que el autor es participante
        if (s.SOLICITANTE_ID !== data.evaluador_id && s.RECEPTOR_ID !== data.evaluador_id) {
            throw new Error('No eres participante de esta sesión');
        }

        // Verificar que el evaluado es el otro participante
        const evaluadoEsparticipante =
            (data.evaluado_id === s.SOLICITANTE_ID || data.evaluado_id === s.RECEPTOR_ID) &&
            data.evaluado_id !== data.evaluador_id;

        if (!evaluadoEsparticipante) throw new Error('El evaluado no es participante de esta sesión');
        console.log('evaluador_id:', data.evaluador_id, typeof data.evaluador_id);
        console.log('evaluado_id:', data.evaluado_id, typeof data.evaluado_id);
        console.log('SOLICITANTE_ID:', s.SOLICITANTE_ID, typeof s.SOLICITANTE_ID);
        console.log('RECEPTOR_ID:', s.RECEPTOR_ID, typeof s.RECEPTOR_ID);

        // Evitar duplicados
        const existing = await connection.execute(
            `SELECT id FROM resenas
             WHERE sesion_id = :sesion_id AND evaluador_id = :evaluador_id`,
            { sesion_id: data.sesion_id, evaluador_id: data.evaluador_id },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        if (existing.rows.length > 0) throw new Error('Ya dejaste una reseña para esta sesión');

        // Insertar reseña
        const result = await connection.execute(
            `INSERT INTO resenas (sesion_id, evaluador_id, evaluado_id, calificacion, comentario, fecha)
             VALUES (:sesion_id, :evaluador_id, :evaluado_id, :calificacion, :comentario, CURRENT_TIMESTAMP)
             RETURNING id INTO :id`,
            {
                sesion_id: data.sesion_id,
                evaluador_id: data.evaluador_id,
                evaluado_id: data.evaluado_id,
                calificacion: data.calificacion,
                comentario: data.comentario || null,
                id: { dir: db.oracledb.BIND_OUT, type: db.oracledb.NUMBER }
            }
        );

        // Actualizar reputacion promedio del evaluado
        await connection.execute(
            `UPDATE usuarios SET reputacion_promedio = (
                SELECT AVG(calificacion) FROM resenas WHERE evaluado_id = :id
             ) WHERE id = :id`,
            { id: data.evaluado_id }
        );

        await connection.commit();

        return { id: result.outBinds.id[0], message: 'Reseña enviada correctamente' };

    } finally {
        if (connection) await connection.close();
    }
};

const getResenasByUsuario = async (userId) => {
    let connection;
    try {
        connection = await db.getConnection();

        const result = await connection.execute(
            `SELECT r.id, r.calificacion, r.comentario, r.fecha,
                    u.nombre AS autor, u.alias AS autor_alias
             FROM resenas r
             JOIN usuarios u ON u.id = r.evaluador_id
             WHERE r.evaluado_id = :id
             ORDER BY r.fecha DESC`,
            { id: userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows.map(row => ({
            id: row.ID,
            calificacion: row.CALIFICACION,
            comentario: row.COMENTARIO,
            fecha: row.FECHA,
            autor: row.AUTOR,
            autor_alias: row.AUTOR_ALIAS,
        }));

    } finally {
        if (connection) await connection.close();
    }
};

const getPromedioByUsuario = async (userId) => {
    let connection;
    try {
        connection = await db.getConnection();

        const result = await connection.execute(
            `SELECT reputacion_promedio FROM usuarios WHERE id = :id`,
            { id: userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        return {
            promedio: result.rows[0]?.REPUTACION_PROMEDIO || 0,
        };

    } finally {
        if (connection) await connection.close();
    }
};

module.exports = { crearResena, getResenasByUsuario, getPromedioByUsuario };