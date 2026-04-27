const db = require('../db');

// =========================
// GET SKILLS
// =========================
const getSkills = async () => {
    let connection;

    try {
        connection = await db.getConnection();

        const result = await connection.execute(
            `SELECT id, nombre, categoria FROM habilidades`
        );

        return result.rows.map(row => ({
            id: row.ID,
            nombre: row.NOMBRE,
            categoria: row.CATEGORIA || null
        }));

    } finally {
        if (connection) await connection.close();
    }
};


// =========================
// CREATE SKILL
// =========================
const createSkill = async (data) => {
    let connection;

    try {
        if (!data.nombre || !data.nombre.trim()) {
            throw new Error('Nombre requerido');
        }

        const nombre = data.nombre.trim().toLowerCase();

        connection = await db.getConnection();

        const existing = await connection.execute(
            `SELECT id FROM habilidades WHERE LOWER(nombre) = LOWER(:nombre)`,
            { nombre }
        );

        if (existing.rows.length > 0) {
            throw new Error('La skill ya existe');
        }

        const result = await connection.execute(
            `INSERT INTO habilidades (nombre, categoria)
             VALUES (:nombre, :categoria)
             RETURNING id INTO :id`,
            {
                nombre,
                categoria: data.categoria || null,
                id: { dir: db.oracledb.BIND_OUT, type: db.oracledb.NUMBER }
            }
        );

        await connection.commit();

        return {
            id: result.outBinds.id[0],
            nombre,
            categoria: data.categoria || null
        };

    } finally {
        if (connection) await connection.close();
    }
};


// =========================
// UPDATE SKILL
// =========================
const updateSkill = async (id, data) => {
    let connection;

    try {
        if (!data.nombre || !data.nombre.trim()) {
            throw new Error('Nombre requerido');
        }

        const nombre = data.nombre.trim().toLowerCase();

        connection = await db.getConnection();

        const existing = await connection.execute(
            `SELECT id FROM habilidades
             WHERE LOWER(nombre) = LOWER(:nombre)
             AND id != :id`,
            { nombre, id }
        );

        if (existing.rows.length > 0) {
            throw new Error('La skill ya existe');
        }

        const result = await connection.execute(
            `UPDATE habilidades
             SET nombre = :nombre,
                 categoria = :categoria
             WHERE id = :id`,
            {
                id,
                nombre,
                categoria: data.categoria || null
            }
        );

        if (result.rowsAffected === 0) {
            throw new Error('Skill no encontrada');
        }

        await connection.commit();

        return {
            id,
            nombre,
            categoria: data.categoria || null
        };

    } finally {
        if (connection) await connection.close();
    }
};


// =========================
// DELETE SKILL
// =========================
const deleteSkill = async (id) => {
    let connection;

    try {
        connection = await db.getConnection();

        await connection.execute(
            `DELETE FROM usuario_habilidades WHERE habilidad_id = :id`,
            { id }
        );

        const result = await connection.execute(
            `DELETE FROM habilidades WHERE id = :id`,
            { id }
        );

        if (result.rowsAffected === 0) {
            throw new Error('Skill no encontrada');
        }

        await connection.commit();

        return {
            id,
            message: 'Skill eliminada correctamente'
        };

    } finally {
        if (connection) await connection.close();
    }
};


// =========================
// ADD SKILL TO USER
// =========================
const addSkillToUser = async (data) => {
    let connection;

    try {
        if (!data.usuario_id || !data.habilidad_id || !data.tipo) {
            throw new Error('Datos incompletos');
        }

        const usuarioId = Number(data.usuario_id);
        const habilidadId = Number(data.habilidad_id);

        if (isNaN(usuarioId) || isNaN(habilidadId)) {
            throw new Error('IDs inválidos');
        }

        const tipo = data.tipo.trim().toUpperCase();

        if (!['OFRECE', 'BUSCA'].includes(tipo)) {
            throw new Error('Tipo inválido');
        }

        connection = await db.getConnection();

        const user = await connection.execute(
            `SELECT id FROM usuarios WHERE id = :id`,
            { id: usuarioId }
        );

        if (user.rows.length === 0) {
            throw new Error('Usuario no existe');
        }

        const skill = await connection.execute(
            `SELECT id, LOWER(nombre) as nombre FROM habilidades WHERE id = :id`,
            { id: habilidadId }
        );

        if (skill.rows.length === 0) {
            throw new Error('Skill no existe');
        }

        const existing = await connection.execute(
            `SELECT id FROM usuario_habilidades
             WHERE usuario_id = :usuario_id
             AND habilidad_id = :habilidad_id
             AND tipo = :tipo`,
            { usuario_id: usuarioId, habilidad_id: habilidadId, tipo }
        );

        if (existing.rows.length > 0) {
            throw new Error('La skill ya está asignada');
        }

        await connection.execute(
            `INSERT INTO usuario_habilidades (usuario_id, habilidad_id, tipo)
             VALUES (:usuario_id, :habilidad_id, :tipo)`,
            { usuario_id: usuarioId, habilidad_id: habilidadId, tipo }
        );

        await connection.commit();

        return {
            message: 'Habilidad asignada correctamente'
        };

    } finally {
        if (connection) await connection.close();
    }
};

module.exports = {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    addSkillToUser
};