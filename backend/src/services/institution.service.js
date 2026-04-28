const db = require('../db');

const getAllInstitutions = async () => {
    let connection;
    try {
        connection = await db.getConnection();
        const result = await connection.execute(
            `SELECT id, nombre FROM instituciones ORDER BY nombre ASC`,
            [],
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows.map(row => ({
            id: row.ID,
            nombre: row.NOMBRE
        }));
    } finally {
        if (connection) await connection.close();
    }
};

module.exports = { getAllInstitutions };
