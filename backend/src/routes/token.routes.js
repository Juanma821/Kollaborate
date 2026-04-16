const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth.middleware');
const { getSaldo, transferir } = require('../controllers/token.controller');

router.get('/saldo', verifyToken, getSaldo);
router.post('/transferir', verifyToken, transferir);

module.exports = router;