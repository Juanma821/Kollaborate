const db = require('../db');

//  Obtener usuario
const getUserById = async (id) => {
    let connection;

    try {
        connection = await db.getConnection();

        const result = await connection.execute(
            `SELECT id, email, nombre, apellido
             FROM usuarios
             WHERE id = :id`,
            [id]
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

//  actualizar usuario
const updateUser = async (id, data) => {
    let connection;

    try {
        connection = await db.getConnection();

        await connection.execute(
            `UPDATE usuarios
             SET nombre = :nombre,
                 email = :email
             WHERE id = :id`,
            {
                id,
                nombre: data.name,
                email: data.email
            }
        );

        await connection.commit();

        return await getUserById(id);

    } finally {
        if (connection) await connection.close();
    }
};

module.exports = {
    getUserById,
    updateUser
};