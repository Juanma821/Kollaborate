const oracledb = require('oracledb');

//  Activar modo THICK (Instant Client)
oracledb.initOracleClient({
    libDir: "D:/Herramientas/Oracle/instantclient_23_0" 
});

// Ruta al wallet 
process.env.TNS_ADMIN = "C:/Users/gonga/Desktop/Portafolio/conexiondb";


const app = require('./app');

//  Levantar servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});