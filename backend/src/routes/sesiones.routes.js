const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { getSesiones, finalizarSesion, cancelarSesion } = require('../controllers/sesiones.controller');

router.get('/', verifyToken, getSesiones);
router.put('/:id/finalizar', verifyToken, finalizarSesion);
router.put('/:id/cancelar', verifyToken, cancelarSesion);

module.exports = router;