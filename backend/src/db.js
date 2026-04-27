require('dotenv').config();
const oracledb = require('oracledb');

// =========================
// CONFIG GLOBAL
// =========================

// Wallet / TNS (ANTES del init)
process.env.TNS_ADMIN = process.env.TNS_ADMIN;

// Inicializar Oracle Client (solo una vez)
if (!oracledb.oracleClientVersion) {
    try {
        oracledb.initOracleClient({
            libDir: process.env.ORACLE_CLIENT
        });
        console.log("🟢 Oracle Client inicializado");
    } catch (err) {
        console.error("❌ Error inicializando Oracle Client:", err);
        process.exit(1);
    }
}

// Formato global
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


// =========================
// POOL DE CONEXIONES
// =========================
const initPool = async () => {
    try {
        await oracledb.createPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING,
            poolMin: 1,
            poolMax: 5,
            poolIncrement: 1
        });

        console.log("🟢 Oracle pool listo");

    } catch (error) {
        console.error("❌ Error creando pool:", error);
        process.exit(1);
    }
};


// =========================
// OBTENER CONEXIÓN
// =========================
const getConnection = async () => {
    try {
        const pool = oracledb.getPool();
        return await pool.getConnection();

    } catch (error) {
        console.error("❌ Error obteniendo conexión:", error);
        throw error;
    }
};


// =========================
// CERRAR POOL
// =========================
const closePool = async () => {
    try {
        const pool = oracledb.getPool();

        if (pool) {
            await pool.close(10);
            console.log("🔴 Oracle pool cerrado");
        }

    } catch (error) {
        console.error("❌ Error cerrando pool:", error);
    }
};


module.exports = {
    initPool,
    getConnection,
    closePool,
    oracledb
};