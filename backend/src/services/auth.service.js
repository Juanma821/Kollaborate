const db = require('../db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


// LOGIN
// =========================
const login = async (email, password) => {
    let connection;

    try {
        if (!email || !password) {
            throw new Error('Email y contrasena requeridos');
        }

        email = email.toLowerCase().trim();

        connection = await db.getConnection();

        const result = await connection.execute(
            `SELECT id, email, nombre, apellido, alias, rol, password_hash 
             FROM usuarios 
             WHERE email = :email`,
            { email }
        );

        const user = result.rows[0];

        if (!user || !user.PASSWORD_HASH) return null;

        const passwordMatch = await bcrypt.compare(password, user.PASSWORD_HASH);

        if (!passwordMatch) return null;

        return {
            id: user.ID,
            email: user.EMAIL,
            nombre: user.NOMBRE,
            apellido: user.APELLIDO,
            alias: user.ALIAS,
            rol: user.ROL
        };

    } catch (error) {
        console.error(error);
        throw error;

    } finally {
        if (connection) await connection.close();
    }
};


// =========================
// REGISTER
// =========================
const register = async (email, password, nombre, apellido, alias) => {
    let connection;

    try {
        // Validaciones básicas
        if (!email || !password || !nombre || !apellido) {
            throw new Error('Todos los campos son obligatorios');
        }

        email = email.toLowerCase().trim();

        if (alias){
            alias = alias.trim().toLowerCase();
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Email invalido');
        }

        // Validar password
        if (password.length < 6) {
            throw new Error('La contrasena debe tener al menos 6 caracteres');
        }

        connection = await db.getConnection();

        // Verificar email existente
        const existing = await connection.execute(
            `SELECT id FROM usuarios WHERE email = :email`,
            { email }
        );

        if (existing.rows.length > 0) return null;

        // Normalizar alias
        if (alias) {
            alias = alias.trim().toLowerCase();

            const existingAlias = await connection.execute(
                `SELECT id FROM usuarios WHERE alias = :alias`,
                { alias }
            );

            if (existingAlias.rows.length > 0) {
                throw new Error('El alias ya esta en uso');
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // INSERT usuario
        const result = await connection.execute(
            `INSERT INTO usuarios (nombre, apellido, email, password_hash, alias)
             VALUES (:nombre, :apellido, :email, :password, :alias)
             RETURNING id INTO :id`,
            {
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                email,
                password: hashedPassword,
                alias: alias || null,
                id: { dir: db.oracledb.BIND_OUT, type: db.oracledb.NUMBER }
            }
        );

        await connection.commit();

        return {
            id: result.outBinds.id[0],
            email,
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            alias: alias || null
        };

    } catch (error) {
        if (error.errorNum === 1) {
            return null; 
        }

        console.error(error);
        throw error;

    } finally {
        if (connection) await connection.close();
    }
};

// FORGOT PASSWORD
// =========================
const forgotPassword = async (email) => {
    let connection;

    try {
        if (!email) {
            throw new Error('Email requerido');
        }

        const normalizedEmail = email.toLowerCase().trim();
        connection = await db.getConnection();

        const userResult = await connection.execute(
            `SELECT id FROM usuarios WHERE email = :email`,
            { email: normalizedEmail }
        );

        if (userResult.rows.length === 0) {
            return {
                success: true,
                message: 'Si el correo existe, se genero un codigo de recuperacion'
            };
        }

        const userId = userResult.rows[0].ID;
        const codigo = crypto.randomInt(100000, 999999).toString();

        await connection.execute(
            `DELETE FROM recuperaciones WHERE usuario_id = :usuario_id`,
            { usuario_id: userId }
        );

        await connection.execute(
            `INSERT INTO recuperaciones (usuario_id, codigo, expiracion)
             VALUES (
                :usuario_id,
                :codigo,
                CURRENT_TIMESTAMP + NUMTODSINTERVAL(12, 'HOUR')
             )`,
            {
                usuario_id: userId,
                codigo
            }
        );

        await connection.commit();

        return {
            success: true,
            message: 'Codigo de recuperacion generado',
            codigo
        };

    } finally {
        if (connection) await connection.close();
    }
};


// =========================
// RESET PASSWORD
// =========================
const resetPassword = async (email, codigo, newPassword) => {
    let connection;

    try {
        if (!email || !codigo || !newPassword) {
            throw new Error('Email, codigo y nueva contrasena son obligatorios');
        }

        if (newPassword.length < 6) {
            throw new Error('La contrasena debe tener al menos 6 caracteres');
        }

        const normalizedEmail = email.toLowerCase().trim();
        connection = await db.getConnection();

        const result = await connection.execute(
            `SELECT u.id, r.id AS recuperacion_id, r.codigo, r.expiracion
             FROM usuarios u
             JOIN recuperaciones r ON r.usuario_id = u.id
             WHERE u.email = :email`,
            { email: normalizedEmail }
        );

        if (result.rows.length === 0) {
            throw new Error('No existe una recuperacion activa para este correo');
        }

        const recovery = result.rows[0];

        if (recovery.CODIGO !== codigo.trim()) {
            throw new Error('Codigo de recuperacion invalido');
        }

        const expirationDate = new Date(recovery.EXPIRACION);
        if (Number.isNaN(expirationDate.getTime()) || expirationDate.getTime() < Date.now()) {
            throw new Error('El codigo de recuperacion expiro');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await connection.execute(
            `UPDATE usuarios SET password_hash = :password WHERE id = :id`,
            {
                password: hashedPassword,
                id: recovery.ID
            }
        );

        await connection.execute(
            `DELETE FROM recuperaciones WHERE id = :id`,
            { id: recovery.RECUPERACION_ID }
        );

        await connection.commit();

        return {
            success: true,
            message: 'Contrasena restablecida correctamente'
        };

    } finally {
        if (connection) await connection.close();
    }
};

module.exports = {
    login,
    register,
    forgotPassword,
    resetPassword
};
