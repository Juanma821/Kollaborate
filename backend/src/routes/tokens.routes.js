const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { getSaldo, getHistorial, loginDiario } = require('../controllers/tokens.controller');

router.get('/saldo', verifyToken, getSaldo);
router.get('/historial', verifyToken, getHistorial);
router.post('/login-diario', verifyToken, loginDiario);

module.exports = router;