require('dotenv').config();

const app = require('./app');
const db = require('./db');


const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await db.initPool();

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error iniciando servidor:", error);
    }
};

startServer();