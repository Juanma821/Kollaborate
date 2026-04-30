const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const {
    createSolicitud,
    getSolicitudesRecibidas,
    getSolicitudesEnviadas,
    getMatches,
    aceptarSolicitud,
    rechazarSolicitud,
    getSolicitudById
} = require('../controllers/solicitudes.controller');

// Rutas principales
router.post('/', verifyToken, createSolicitud);
router.get('/recibidas', verifyToken, getSolicitudesRecibidas);
router.get('/enviadas', verifyToken, getSolicitudesEnviadas);
router.get('/matches', verifyToken, getMatches);
router.get('/:id', verifyToken, getSolicitudById);

// Acciones
router.put('/:id/aceptar', verifyToken, aceptarSolicitud);
router.put('/:id/rechazar', verifyToken, rechazarSolicitud);

module.exports = router;