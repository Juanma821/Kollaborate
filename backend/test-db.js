const oracledb = require('oracledb');

// 🔴 IMPORTANTE: ruta al wallet (donde están tnsnames.ora, sqlnet.ora, etc.)
process.env.TNS_ADMIN = "C:/Users/gonga/Desktop/Portafolio/conexiondb";

// 🔴 IMPORTANTE: activar modo thick (usa tu ruta real del instant client)
oracledb.initOracleClient({
    libDir: "D:/Herramientas/Oracle/instantclient_23_0" // ⚠️ CAMBIA esto si tu ruta es distinta
});

// 🔵 (opcional pero útil)
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function testConnection() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "Usuario2",
            password: "DuocUC123456",
            connectString: "kldhz48x2nkrpwvg_medium" // debe existir en tnsnames.ora
        });

        console.log("✅ Conectado a Oracle");

        const result = await connection.execute(
            `SELECT 'OK' AS STATUS FROM DUAL`
        );

        console.log(result.rows);

    } catch (err) {
        console.error("❌ Error completo:");
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log("🔌 Conexión cerrada");
            } catch (err) {
                console.error("Error cerrando conexión:", err);
            }
        }
    }
}

testConnection();