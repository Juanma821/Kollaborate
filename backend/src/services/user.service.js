const db = require('../db');

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// GET usuario
const getUserById = async (id) => {
    let connection;

    try {
        connection = await db.getConnection();

        const result = await connection.execute(
            `SELECT id, email, nombre, apellido
             FROM usuarios
             WHERE id = :id`,
            { id }
        );

        const user = result.rows[0];
        if (!user) return null;

        return {
            id: user.ID,
            email: user.EMAIL,
            name: `${user.NOMBRE} ${user.APELLIDO || ''}`.trim()
        };

    } finally {
        if (connection) await connection.close();
    }
};

// UPDATE
const updateUser = async (id, data) => {
    let connection;

    try {
        connection = await db.getConnection();

        //  validaciones
        if (!data.name || !data.email) {
            throw new Error('Nombre y email son obligatorios');
        }

        if (!isValidEmail(data.email)) {
            throw new Error('Email inválido');
        }

        // separar nombre
        const parts = data.name.trim().split(' ');
        const nombre = parts[0];
        const apellido = parts.slice(1).join(' ') || '';

        // verificar duplicado
        const existing = await connection.execute(
            `SELECT id FROM usuarios WHERE email = :email AND id != :id`,
            { email: data.email, id }
        );

        if (existing.rows.length > 0) {
            throw new Error('El email ya está en uso');
        }

        const result = await connection.execute(
            `UPDATE usuarios
             SET nombre = :nombre,
                 apellido = :apellido,
                 email = :email
             WHERE id = :id`,
            {
                id,
                nombre,
                apellido,
                email: data.email
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