const oracledb = require('../db');
const bcrypt = require('bcrypt');

// process.env.TNS_ADMIN = "C:/Users/gonga/Desktop/Portafolio/conexiondb";

//  LOGIN
const login = async (email, password) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "Usuario2",
            password: "DuocUC123456",
            connectString: "kldhz48x2nkrpwvg_medium"
        });

        const result = await connection.execute(
            `SELECT id, email, nombre, apellido, password_hash 
             FROM usuarios 
             WHERE email = :email`,
            [email],
            { outFormat: oracledb.OUT_FORMAT_OBJECT}
        );

        const user = result.rows[0];

        console.log("USER DESDE BD:", user);

        if (!user || !user.PASSWORD_HASH) return null;

        const passwordMatch = await bcrypt.compare(password, user.PASSWORD_HASH);

        if (!passwordMatch) return null;

        return {
            id: user.ID,
            email: user.EMAIL,
            name: `${user.NOMBRE} ${user.APELLIDO || ''}`.trim()
        };

    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};


//  REGISTER
const register = async (email, password, name) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "Usuario2",
            password: "DuocUC123456",
            connectString: "kldhz48x2nkrpwvg_medium"
        });

        //  verificar si ya existe
        const existing = await connection.execute(
            `SELECT id FROM usuarios WHERE email = :email`,
            [email]
        );

        if (existing.rows.length > 0) return null;

        //  hash contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        //  separar nombre y apellido (simple)
        const [nombre, apellido] = name.split(" ");

        const result = await connection.execute(
            `INSERT INTO usuarios (nombre, apellido, email, password_hash)
             VALUES (:nombre, :apellido, :email, :password)
             RETURNING id INTO :id`,
            {
                nombre,
                apellido: apellido || '',
                email,
                password: hashedPassword,
                id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            }
        );

        await connection.commit();

        const newId = result.outBinds.id[0];

        return {
            id: newId,
            email,
            name
        };

    } catch (error) {
        if (error.errorNum === 1){
            return null;
        }

        console.error(error);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

module.exports = { login, register };