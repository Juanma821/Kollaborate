const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { crearResena, getResenasByUsuario, getPromedioByUsuario } = require('../controllers/resenas.controller');

router.post('/', verifyToken, crearResena);
router.get('/usuario/:userId', getResenasByUsuario);
router.get('/promedio/:userId', getPromedioByUsuario);

module.exports = router;