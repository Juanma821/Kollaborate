const oracledb = require('oracledb');

process.env.TNS_ADMIN = "C:/Users/gonga/Desktop/Portafolio/conexiondb";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

module.exports = oracledb;