const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth.middleware');
const {
    createSolicitud,
    getSolicitudes,
    aceptarSolicitud,
    rechazarSolicitud
} = require('../controllers/solicitudes.controller');

router.post('/', verifyToken, createSolicitud);
router.get('/', verifyToken, getSolicitudes);
router.put('/:id/aceptar', verifyToken, aceptarSolicitud);
router.put('/:id/rechazar', verifyToken, rechazarSolicitud);

module.exports = router;