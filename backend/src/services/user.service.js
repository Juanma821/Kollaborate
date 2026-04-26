const db = require('../db');
const bcrypt = require('bcrypt');

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

        if (!data.nombre || !data.apellido) {
            throw new Error('Nombre y apellido son obligatorios');
        }

        // Validar email SOLO si viene
        if (data.email) {
            if (!isValidEmail(data.email)) {
                throw new Error('Email inválido');
            }

            const existing = await connection.execute(
                `SELECT id FROM usuarios WHERE email = :email AND id != :id`,
                { email: data.email, id }
            );

            if (existing.rows.length > 0) {
                throw new Error('El email ya está en uso');
            }
        }

        // Validar alias
        if (data.alias && data.alias.trim() !== "") {
            const existingAlias = await connection.execute(
                `SELECT id FROM usuarios WHERE alias = :alias AND id != :id`,
                { alias: data.alias, id }
            );

            if (existingAlias.rows.length > 0) {
                throw new Error('Este alias ya está siendo usado');
            }
        }

        const sql = `
            UPDATE usuarios
            SET nombre = :nombre,
                apellido = :apellido,
                email = COALESCE(:email, email),
                alias = :alias,
                institucion_id = :institucion_id,
                fecha_nacimiento = CASE
                    WHEN :fecha_nacimiento IS NOT NULL
                    THEN TO_DATE(:fecha_nacimiento, 'YYYY-MM-DD')
                    ELSE fecha_nacimiento
                END
            WHERE id = :id
        `;

        await connection.execute(
            sql,
            {
                id,
                nombre: data.nombre.trim(),
                apellido: data.apellido.trim(),
                email: data.email ? data.email.toLowerCase().trim() : null,
                alias: data.alias || null,
                institucion_id: data.institucion_id || null,
                fecha_nacimiento: data.fecha_nacimiento || null
            },
            { autoCommit: true }
        );

        return await getUserById(id);

    } finally {
        if (connection) await connection.close();
    }
};

//  UPDATE PASSWORD
// =========================
const updatePassword = async (id, currentPassword, newPassword) => {
    let connection;
    try {
        connection = await db.getConnection();

        // Buscar Contraseña
        const result = await connection.execute(
            `SELECT password_hash FROM usuarios WHERE id = :id`,
            { id }
        );

        if (result.rows.length === 0) throw new Error('Usuario no encontrado');

        const hashedPassword = result.rows[0].PASSWORD_HASH;

        // Comparar Contraseña
        const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
        if (!isMatch) {
            throw new Error('La contraseña actual es incorrecta');
        }

        // Encriptar Nueva Contraseña
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        // Actualizar
        await connection.execute(
            `UPDATE usuarios SET password_hash = :password_hash WHERE id = :id`,
            { password_hash: newHashedPassword, id },
            { autoCommit: true }
        );

        return { success: true, message: 'Contraseña actualizada correctamente' };

    } catch (error) {
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

module.exports = {
    getUserById,
    updateUser,
    updatePassword
};