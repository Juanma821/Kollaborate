const oracledb = require('oracledb');

process.env.TNS_ADMIN = "C:/Users/gonga/Desktop/Portafolio/conexiondb";

async function testConnection() {
    try {
        const connection = await oracledb.getConnection({
            user: 'Usuario2',
            password: 'DuocUC123456',
            connectString: 'kldhz48x2nkrpwvg_medium'
        });

        console.log('✅ Conectado a Oracle');

        const result = await connection.execute(`SELECT * FROM DUAL`);
        console.log(result.rows);

        await connection.close();

    } catch (err) {
        console.error('❌ Error:', err);
    }
}

testConnection();