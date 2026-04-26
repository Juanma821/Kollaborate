const db = require('../db');

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


//  GET USUARIO
// =========================
const getUserById = async (id) => {
    let connection;

    try {
        connection = await db.getConnection();

        const result = await connection.execute(
            `SELECT 
                id, email, nombre, apellido,
                alias,
                reputacion_promedio,
                foto_url,
                fecha_nacimiento,
                rol
             FROM usuarios
             WHERE id = :id`,
            { id }
        );

        const user = result.rows[0];
        if (!user) return null;

        return {
            id: user.ID,
            email: user.EMAIL,
            nombre: user.NOMBRE,
            apellido: user.APELLIDO,
            name: `${user.NOMBRE} ${user.APELLIDO || ''}`.trim(),
            alias: user.ALIAS,
            reputacion: user.REPUTACION_PROMEDIO || 0,
            foto: user.FOTO_URL,
            fecha_nacimiento: user.FECHA_NACIMIENTO,
            rol: user.ROL
        };

    } finally {
        if (connection) await connection.close();
    }
};



//  UPDATE USUARIO
// =========================
const updateUser = async (id, data) => {
    let connection;
    try {
        connection = await db.getConnection();

        // Validaciones básicas
        if (!data.nombre || !data.apellido) {
            throw new Error('Nombre y apellido son obligatorios');
        }

        //Validacion Email
        if (data.email && !isValidEmail(data.email)) {
            throw new Error('Email inválido');
        }

        // Verificar duplicado de Email
        const existing = await connection.execute(
            `SELECT id FROM usuarios WHERE email = :email AND id != :id`,
            { email: data.email, id }
        );

        if (existing.rows.length > 0) {
            throw new Error('El email ya está en uso');
        }

        // Verificar duplicado de Alias
        if (data.alias && data.alias.trim() !== "") {
            const existingAlias = await connection.execute(
                `SELECT id FROM usuarios WHERE alias = :alias AND id != :id`,
                { alias: data.alias, id }
            );

            if (existingAlias.rows.length > 0) {
                throw new Error('Este alias ya está siendo usado por otro usuario');
            }
        }

        // Update
        const sql = `
            UPDATE usuarios
            SET nombre = :nombre,
                apellido = :apellido,
                alias = :alias,
                institucion_id = :institucion_id,
                fecha_nacimiento = TO_DATE(:fecha_nacimiento, 'YYYY-MM-DD')
            WHERE id = :id`;

        const result = await connection.execute(
            sql,
            {
                id,
                nombre: data.nombre,
                apellido: data.apellido,
                alias: data.alias || null,
                institucion_id: data.institucion_id || null,
                fecha_nacimiento: data.fecha_nacimiento
            },
            { autoCommit: true }
        );

        return await getUserById(id);
    } finally {
        if (connection) await connection.close();
    }
};

module.exports = {
    getUserById,
    updateUser
};