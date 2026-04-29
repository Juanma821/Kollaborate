const express = require('express');
const router = express.Router();

const { getHistorial, enviarMensaje } = require('../controllers/mensajes.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/:sesionId', verifyToken, getHistorial);
router.post('/', verifyToken, enviarMensaje);

module.exports = router;