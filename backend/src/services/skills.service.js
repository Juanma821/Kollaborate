const db = require('../db');

//  Obtener todas las skills
const getSkills = async () => {
    let connection;

    try {
        connection = await db.getConnection();

        const result = await connection.execute(
            `SELECT id, nombre, categoria FROM habilidades`
        );

        return result.rows;

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

        // Eliminar relaciones primero
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

//  Asignar skill a usuario (Ofrece / Busca)
const addSkillToUser = async (data) => {
    let connection;

    try {
        connection = await db.getConnection();

        await connection.execute(
            `INSERT INTO usuario_habilidades (usuario_id, habilidad_id, tipo, nivel)
             VALUES (:usuario_id, :habilidad_id, :tipo, :nivel)`,
            {
                usuario_id: data.usuario_id,
                habilidad_id: data.habilidad_id,
                tipo: data.tipo,
                nivel: data.nivel
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