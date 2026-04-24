const db = require('../db');

//  Obtener todas las skills
const getSkills = async () => {
    let connection;

    try {
        connection = await db.getConnection();

        const result = await connection.execute(
            `SELECT id, nombre, categoria FROM habilidades`
        );

        // devolver limpio
        return result.rows.map(row => ({
            id: row.ID,
            nombre: row.NOMBRE,
            categoria: row.CATEGORIA
        }));

    } finally {
        if (connection) await connection.close();
    }
};

//  Crear skill
const createSkill = async (data) => {
    let connection;

    try {
        if (!data.nombre) {
            throw new Error('Nombre requerido');
        }

        connection = await db.getConnection();

        //  evitar duplicados
        const existing = await connection.execute(
            `SELECT id FROM habilidades WHERE LOWER(nombre) = LOWER(:nombre)`,
            { nombre: data.nombre }
        );

        if (existing.rows.length > 0) {
            throw new Error('La skill ya existe');
        }

        const result = await connection.execute(
            `INSERT INTO habilidades (nombre, categoria)
             VALUES (:nombre, :categoria)
             RETURNING id INTO :id`,
            {
                nombre: data.nombre,
                categoria: data.categoria || null,
                id: { dir: db.oracledb.BIND_OUT, type: db.oracledb.NUMBER }
            }
        );

        await connection.commit();

        return {
            id: result.outBinds.id[0],
            nombre: data.nombre,
            categoria: data.categoria
        };

    } finally {
        if (connection) await connection.close();
    }
};

//  Actualizar skill
const updateSkill = async (id, data) => {
    let connection;

    try {
        connection = await db.getConnection();

        const result = await connection.execute(
            `UPDATE habilidades
             SET nombre = :nombre,
                 categoria = :categoria
             WHERE id = :id`,
            {
                id,
                nombre: data.nombre,
                categoria: data.categoria
            }
        );

        await connection.commit();

        if (result.rowsAffected === 0) return null;

        return { message: 'Skill actualizada' };

    } finally {
        if (connection) await connection.close();
    }
};

//  Eliminar skill
const deleteSkill = async (id) => {
    let connection;

    try {
        connection = await db.getConnection();

        // eliminar relaciones primero
        await connection.execute(
            `DELETE FROM usuario_habilidades WHERE habilidad_id = :id`,
            { id }
        );

        const result = await connection.execute(
            `DELETE FROM habilidades WHERE id = :id`,
            { id }
        );

        await connection.commit();

        if (result.rowsAffected === 0) return null;

        return { message: 'Skill eliminada correctamente' };

    } finally {
        if (connection) await connection.close();
    }
};

// 🔹 Asignar skill a usuario (Ofrece / Busca)
const addSkillToUser = async (data) => {
    let connection;

    try {
        connection = await db.getConnection();

        //  validar usuario
        const user = await connection.execute(
            `SELECT id FROM usuarios WHERE id = :id`,
            { id: data.usuario_id }
        );

        if (user.rows.length === 0) {
            throw new Error('Usuario no existe');
        }

        // 🔍 validar skill
        const skill = await connection.execute(
            `SELECT id FROM habilidades WHERE id = :id`,
            { id: data.habilidad_id }
        );

        if (skill.rows.length === 0) {
            throw new Error('Skill no existe');
        }

        //  evitar duplicados
        const existing = await connection.execute(
            `SELECT id FROM usuario_habilidades
             WHERE usuario_id = :usuario_id
             AND habilidad_id = :habilidad_id
             AND tipo = :tipo`,
            {
                usuario_id: data.usuario_id,
                habilidad_id: data.habilidad_id,
                tipo: data.tipo
            }
        );

        if (existing.rows.length > 0) {
            throw new Error('La skill ya está asignada');
        }

        //  insertar
        await connection.execute(
            `INSERT INTO usuario_habilidades (usuario_id, habilidad_id, tipo)
             VALUES (:usuario_id, :habilidad_id, :tipo)`,
            {
                usuario_id: data.usuario_id,
                habilidad_id: data.habilidad_id,
                tipo: data.tipo
            }
        );

        await connection.commit();

        return { message: 'Habilidad asignada correctamente' };

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