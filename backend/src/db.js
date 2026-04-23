require('dotenv').config();
const oracledb = require('oracledb');

// Oracle Instant Client
oracledb.initOracleClient({
    libDir: "D:/Herramientas/Oracle/instantclient_23_0"
});

// Wallet / TNS
process.env.TNS_ADMIN = "C:/Users/gonga/Desktop/Portafolio/conexiondb";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

//  Pool de conexiones
const initPool = async () => {
    await oracledb.createPool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONNECT_STRING,
        poolMin: 1,
        poolMax: 5,
        poolIncrement: 1
    });

    console.log("🟢 Oracle pool listo");
};

//  conexión desde pool
const getConnection = async () => {
    return await oracledb.getConnection();
};

module.exports = {
    initPool,
    getConnection,
    oracledb
};