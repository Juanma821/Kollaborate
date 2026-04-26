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

        //  Validaciones básicas
        if (!data.name || !data.email) {
            throw new Error('Nombre y email son obligatorios');
        }

        if (!isValidEmail(data.email)) {
            throw new Error('Email inválido');
        }

        //  Separar nombre
        const parts = data.name.trim().split(' ');
        const nombre = parts[0];
        const apellido = parts.slice(1).join(' ') || '';

        //  Validar email duplicado
        const existingEmail = await connection.execute(
            `SELECT id FROM usuarios WHERE email = :email AND id != :id`,
            { email: data.email, id }
        );

        if (existingEmail.rows.length > 0) {
            throw new Error('El email ya está en uso');
        }

        //  Validar alias duplicado (si viene)
        if (data.alias) {
            const existingAlias = await connection.execute(
                `SELECT id FROM usuarios WHERE alias = :alias AND id != :id`,
                { alias: data.alias, id }
            );

            if (existingAlias.rows.length > 0) {
                throw new Error('El alias ya está en uso');
            }
        }

        //  Update
        const result = await connection.execute(
            `UPDATE usuarios
             SET nombre = :nombre,
                 apellido = :apellido,
                 email = :email,
                 alias = :alias
             WHERE id = :id`,
            {
                id,
                nombre,
                apellido,
                email: data.email,
                alias: data.alias || null
            }
        );

        await connection.commit();

        if (result.rowsAffected === 0) return null;

        return await getUserById(id);

    } finally {
        if (connection) await connection.close();
    }
};

module.exports = {
    getUserById,
    updateUser
};