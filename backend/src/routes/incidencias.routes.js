const express = require('express');
const router = express.Router();
const { postReporte } = require('../controllers/incidencias.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, postReporte);

module.exports = router;