const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { getSesiones } = require('../controllers/sesiones.controller');

router.get('/', verifyToken, getSesiones);

module.exports = router;