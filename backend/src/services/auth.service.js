const db = require('../db');
const bcrypt = require('bcrypt');

// LOGIN
const login = async (email, password) => {
    let connection;

    try {
        if (!email || !password) {
            throw new Error('Email y contraseña requeridos');
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
            name: `${user.NOMBRE} ${user.APELLIDO || ''}`.trim(),
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


// REGISTER
const register = async (email, password, name, alias) => {
    let connection;

    try {
        //  validaciones básicas
        if (!email || !password || !name) {
            throw new Error('Todos los campos son obligatorios');
        }

        //  normalizar email
        email = email.toLowerCase().trim();

        //  validar formato email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Email inválido');
        }

        //  validar password
        if (password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        connection = await db.getConnection();

        //  verificar si ya existe
        const existing = await connection.execute(
            `SELECT id FROM usuarios WHERE email = :email`,
            { email }
        );

        if (existing.rows.length > 0) return null;

        // Normalizar alias
        if (alias) {
            alias = alias.trim().toLowerCase();
        }

        if (alias) {
            const existingAlias = await connection.execute(
                `SELECT id FROM usuarios WHERE alias = :alias`,
                { alias }
            );

            if (existingAlias.rows.length > 0) {
                throw new Error('El alias ya está en uso');
            }
        }

        //  hash contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        //  limpiar nombre
        const cleanName = name.trim().replace(/\s+/g, ' ');

        if (!cleanName) {
            throw new Error('Nombre inválido');
        }

        const parts = cleanName.split(' ');
        const nombre = parts[0];
        const apellido = parts.slice(1).join(' ') || '';

        //  insertar usuario
        const result = await connection.execute(
            `INSERT INTO usuarios (nombre, apellido, email, password_hash, alias)
             VALUES (:nombre, :apellido, :email, :password, :alias)
             RETURNING id INTO :id`,
            {
                nombre,
                apellido,
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
            name: cleanName,
            alias: alias || null
        };

    } catch (error) {
        //  error de duplicado (unique constraint)
        if (error.errorNum === 1) {
            return null;
        }

        console.error(error);
        throw error;

    } finally {
        if (connection) await connection.close();
    }
};

module.exports = { login, register };