const oracledb = require('oracledb');

// Wallet
process.env.TNS_ADMIN = "C:/Users/gonga/Desktop/Portafolio/conexiondb";

// Instant Client
oracledb.initOracleClient({
    libDir: "D:/Herramientas/Oracle/instantclient_23_0"
});

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function testCRUD() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "Usuario2",
            password: "DuocUC123456",
            connectString: "kldhz48x2nkrpwvg_medium"
        });

        console.log('✅ Conectado');

        //  INSERT
        await connection.execute(
            `INSERT INTO usuarios (nombre, apellido, email, password_hash)
             VALUES ('Test', 'User', 'test@test.com', '1234')`
        );
        await connection.commit();
        console.log('✅ Insert OK');

        //  SELECT
        const result = await connection.execute(
            `SELECT id, nombre, email FROM usuarios WHERE email='test@test.com'`
        );
        console.log(result.rows);

        //  UPDATE
        await connection.execute(
            `UPDATE usuarios SET nombre='NuevoNombre' WHERE email='test@test.com'`
        );
        await connection.commit();
        console.log('✅ Update OK');

        //  DELETE
        await connection.execute(
            `DELETE FROM usuarios WHERE email='test@test.com'`
        );
        await connection.commit();
        console.log('🗑 Delete OK');

        console.log(' CRUD completo funcionando');

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        if (connection) {
            await connection.close();
            console.log('🔌 Conexión cerrada');
        }
    }
}

testCRUD();