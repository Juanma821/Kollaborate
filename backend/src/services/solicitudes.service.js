const db = require('../db');

//  Crear solicitud
const createSolicitud = async (data) => {
    let connection;
    try {
        connection = await db.getConnection();

        // Validar receptor
        const user = await connection.execute(
            `SELECT id FROM usuarios WHERE id = :id`,
            { id: data.receptor_id }
        );

        if (user.rows.length === 0) {
            throw new Error('Usuario receptor no existe');
        }

        if (data.solicitante_id === data.receptor_id) {
            throw new Error('No puedes enviarte solicitud a ti mismo');
        }

        // Evitar duplicados
        const existing = await connection.execute(
            `SELECT id FROM solicitudes 
             WHERE solicitante_id = :s AND receptor_id = :r AND estado_id = 1`,
            { s: data.solicitante_id, r: data.receptor_id }
        );

        if (existing.rows.length > 0) {
            throw new Error('Ya existe una solicitud pendiente');
        }

        const result = await connection.execute(
            `INSERT INTO solicitudes (
                solicitante_id, receptor_id, habilidad_id, 
                estado_id, modalidad, tokens_recompensa, 
                nivel, fecha_propuesta
            ) VALUES (:s, :r, :h, 1, :m, :t, :n, :f)
            RETURNING id INTO :id`,
            {
                s: data.solicitante_id,
                r: data.receptor_id,
                h: data.habilidad_id,
                m: data.modalidad,
                t: data.tokens_recompensa,
                n: data.nivel,
                f: data.fecha_propuesta,
                id: { dir: db.oracledb.BIND_OUT, type: db.oracledb.NUMBER }
            }
        );

        await connection.commit();
        return { id: result.outBinds.id[0], message: 'Solicitud enviada' };

    } finally {
        if (connection) await connection.close();
    }
};

// Obtener solicitudes
const getSolicitudes = async (userId) => {
    let connection;
    try {
        connection = await db.getConnection();
        const result = await connection.execute(
            `SELECT s.id AS "id", 
                    u.nombre AS "usuario", 
                    i.nombre AS "institucion", -- AGREGADO: Nombre de la institución
                    h.nombre AS "habilidad", 
                    s.estado_id AS "estado_id",
                    s.modalidad AS "modalidad",
                    s.tokens_recompensa AS "tokens",
                    s.nivel AS "nivel",
                    TO_CHAR(s.fecha_propuesta, 'YYYY-MM-DD"T"HH24:MI:SS') AS "fecha_propuesta",
                    u.reputacion_promedio AS "reputacion_valor",
                    nr.nombre_nivel AS "nivel_nombre",
                    nr.color_hex AS "nivel_color"
             FROM solicitudes s
             INNER JOIN usuarios u ON s.solicitante_id = u.id
             INNER JOIN habilidades h ON s.habilidad_id = h.id
             -- NUEVO JOIN: Para obtener el nombre de la institución del usuario
             LEFT JOIN instituciones i ON u.institucion_id = i.id
             LEFT JOIN niveles_reputacion nr ON u.nivel_id = nr.id 
             WHERE s.receptor_id = :id AND s.estado_id = 1`,
            { id: userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } catch (error) {
        console.error("❌ ERROR EN GET_SOLICITUDES:", error.message);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

// Aceptar solicitud
const aceptarSolicitud = async (id, userId) => {
    let connection;
    try {
        connection = await db.getConnection();

        const result = await connection.execute(
            `SELECT receptor_id, estado_id, fecha_propuesta
             FROM solicitudes WHERE id = :id`,
            { id },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length === 0) throw new Error('Solicitud no existe');
        const s = result.rows[0];

        if (s.RECEPTOR_ID !== userId) throw new Error('No autorizado');
        if (s.ESTADO_ID !== 1) throw new Error('La solicitud ya fue procesada');

        // Actualizar
        await connection.execute(
            `UPDATE solicitudes SET estado_id = 2 WHERE id = :id`,
            { id }
        );

        // Insertar
        const resSesion = await connection.execute(
            `INSERT INTO sesiones (solicitud_id, fecha_programada, estado_id) 
             VALUES (:solicitud, :fecha, 4)
             RETURNING id INTO :new_id`,
            {
                solicitud: id,
                fecha: s.FECHA_PROPUESTA,
                new_id: { type: db.oracledb.NUMBER, dir: db.oracledb.BIND_OUT }
            }
        );

        await connection.commit();
        return { message: 'Match creado', sesionId: resSesion.outBinds.new_id[0] };

    } catch (error) {
        if (connection) await connection.rollback();
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

// Rechazar solicitud
const rechazarSolicitud = async (id, userId) => {
    let connection;
    try {
        connection = await db.getConnection();
        const result = await connection.execute(
            `SELECT estado_id FROM solicitudes WHERE id = :id AND receptor_id = :userId`,
            { id, userId }
        );

        if (result.rows.length === 0) throw new Error('No encontrada o no autorizada');
        if (result.rows[0].ESTADO_ID !== 1) throw new Error('Ya procesada');

        await connection.execute(
            `UPDATE solicitudes SET estado_id = 3 WHERE id = :id`,
            { id }
        );
        await connection.commit();
        return { message: 'Solicitud rechazada' };
    } finally {
        if (connection) await connection.close();
    }
};

// Obtener solicitudes enviadas
const getSolicitudesEnviadas = async (userId) => {
    let connection;
    try {
        connection = await db.getConnection();
        const result = await connection.execute(
            `SELECT s.id AS "id", 
                    u.nombre AS "usuario", 
                    h.nombre AS "habilidad", 
                    s.estado_id AS "estado_id",
                    s.modalidad AS "modalidad",
                    s.tokens_recompensa AS "tokens",
                    s.nivel AS "nivel",
                    TO_CHAR(s.fecha_propuesta, 'YYYY-MM-DD"T"HH24:MI:SS') AS "fecha_propuesta"
             FROM solicitudes s
             JOIN usuarios u ON u.id = s.receptor_id
             JOIN habilidades h ON h.id = s.habilidad_id
             WHERE s.solicitante_id = :id`,
            { id: userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } finally {
        if (connection) await connection.close();
    }
};

// Obtener matches (sesiones activas)
const getMatches = async (userId) => {
    let connection;
    try {
        connection = await db.getConnection();
        const result = await connection.execute(
            `SELECT ses.id AS "id",  -- IMPORTANTE: Traemos el ID de la SESIÓN
                    h.nombre AS "habilidad",
                    CASE 
                        WHEN sol.solicitante_id = :id THEN u_rec.nombre 
                        ELSE u_sol.nombre 
                    END AS "nombreChat"
             FROM sesiones ses
             JOIN solicitudes sol ON sol.id = ses.solicitud_id
             JOIN usuarios u_sol ON u_sol.id = sol.solicitante_id
             JOIN usuarios u_rec ON u_rec.id = sol.receptor_id
             JOIN habilidades h ON h.id = sol.habilidad_id
             WHERE (sol.solicitante_id = :id OR sol.receptor_id = :id)
             AND sol.estado_id = 2`,
            { id: userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows;
    } finally {
        if (connection) await connection.close();
    }
};

// Obtener solicitud por ID
const getSolicitudById = async (id) => {
    let connection;
    try {
        connection = await db.getConnection();
        const result = await connection.execute(
            `SELECT s.id AS "id", 
                    u.nombre AS "usuario", 
                    h.nombre AS "habilidad", 
                    s.estado_id AS "estado_id",
                    s.modalidad AS "modalidad",
                    s.tokens_recompensa AS "tokens",
                    s.nivel AS "nivel",
                    TO_CHAR(s.fecha_propuesta, 'YYYY-MM-DD"T"HH24:MI:SS') AS "fecha_propuesta"
             FROM solicitudes s
             JOIN usuarios u ON u.id = s.solicitante_id
             JOIN habilidades h ON h.id = s.habilidad_id
             WHERE s.id = :id`,
            { id },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows[0];
    } finally {
        if (connection) await connection.close();
    }
};

module.exports = {
    createSolicitud,
    getSolicitudes,
    aceptarSolicitud,
    rechazarSolicitud,
    getSolicitudesEnviadas,
    getMatches,
    getSolicitudById
};