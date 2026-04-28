const db = require('../db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// LOGIN
const login = async (email, password) => {
    let connection;

    try {
        if (!email || !password) {
            throw new Error('Email y contrasena requeridos');
        }

        email = email.toLowerCase().trim();

        connection = await db.getConnection();

        const result = await connection.execute(
            `SELECT 
                u.id,
                u.email,
                u.nombre,
                u.apellido,
                u.alias,
                u.rol,
                u.password_hash,
                u.institucion_id,
                i.nombre AS institucion_nombre
             FROM usuarios u
             LEFT JOIN instituciones i ON i.id = u.institucion_id
             WHERE u.email = :email`,
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
            rol: user.ROL,
            institucion_id: user.INSTITUCION_ID,
            institucion_nombre: user.INSTITUCION_NOMBRE || null
        };

    } catch (error) {
        console.error(error);
        throw error;

    } finally {
        if (connection) await connection.close();
    }
};

// REGISTER
const register = async (email, password, nombre, apellido, alias, institucion_id) => {
    let connection;

    try {
        if (!email || !password || !nombre || !apellido) {
            throw new Error('Todos los campos son obligatorios');
        }

        email = email.toLowerCase().trim();

        if (alias) {
            alias = alias.trim().toLowerCase();
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Email invalido');
        }

        if (password.length < 6) {
            throw new Error('La contrasena debe tener al menos 6 caracteres');
        }

        connection = await db.getConnection();

        const existing = await connection.execute(
            `SELECT id FROM usuarios WHERE email = :email`,
            { email }
        );

        if (existing.rows.length > 0) return null;

        if (alias) {
            const existingAlias = await connection.execute(
                `SELECT id FROM usuarios WHERE alias = :alias`,
                { alias }
            );

            if (existingAlias.rows.length > 0) {
                throw new Error('El alias ya esta en uso');
            }
        }

        if (institucion_id) {
            const institutionExists = await connection.execute(
                `SELECT id FROM instituciones WHERE id = :id`,
                { id: Number(institucion_id) }
            );

            if (institutionExists.rows.length === 0) {
                throw new Error('La institucion seleccionada no existe');
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await connection.execute(
            `INSERT INTO usuarios (
                nombre,
                apellido,
                email,
                password_hash,
                alias,
                institucion_id
             )
             VALUES (
                :nombre,
                :apellido,
                :email,
                :password,
                :alias,
                :institucion_id
             )
             RETURNING id INTO :id`,
            {
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                email,
                password: hashedPassword,
                alias: alias || null,
                institucion_id: institucion_id ? Number(institucion_id) : null,
                id: { dir: db.oracledb.BIND_OUT, type: db.oracledb.NUMBER }
            }
        );

        await connection.commit();

        let institucionNombre = null;

        if (institucion_id) {
            const institutionResult = await connection.execute(
                `SELECT nombre FROM instituciones WHERE id = :id`,
                { id: Number(institucion_id) }
            );

            institucionNombre = institutionResult.rows[0]?.NOMBRE || null;
        }

        return {
            id: result.outBinds.id[0],
            email,
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            alias: alias || null,
            rol: 'estudiante',
            institucion_id: institucion_id ? Number(institucion_id) : null,
            institucion_nombre: institucionNombre
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

        console.log('===================================');
        console.log('CODIGO DE RECUPERACION GENERADO');
        console.log('Correo:', normalizedEmail);
        console.log('Codigo:', codigo);
        console.log('===================================');

        return {
            success: true,
            message: 'Codigo de recuperacion generado',
            codigo
        };

    } finally {
        if (connection) await connection.close();
    }
};

// RESET PASSWORD
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
