const express = require('express');
const router = express.Router();

const {
    solicitar,
    aceptar,
    rechazar,
    misSolicitudes,
    solicitudesRecibidas
} = require('../controllers/intercambio.controller');

router.post('/solicitar', solicitar);
router.put('/aceptar/:id', aceptar);
router.put('/rechazar/:id', rechazar);

router.get('/mis-solicitudes/:userId', misSolicitudes);
router.get('/recibidas/:userId', solicitudesRecibidas);

module.exports = router;