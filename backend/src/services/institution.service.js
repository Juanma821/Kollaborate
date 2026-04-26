const db = require('../db');

const getAllInstitutions = async () => {
    let connection;
    try {
        connection = await db.getConnection();
        const result = await connection.execute(
            `SELECT id, nombre FROM instituciones ORDER BY nombre ASC`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows; 
    } finally {
        if (connection) await connection.close();
    }
};

module.exports = { getAllInstitutions };