const solicitudesService = require('../services/solicitudes.service');

// crear
const createSolicitud = async (req, res) => {
    try {
        const result = await solicitudesService.createSolicitud({
            solicitante_id: req.user.id,
            receptor_id: req.body.receptor_id,
            habilidad_id: req.body.habilidad_id
        });

        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// obtener
const getSolicitudes = async (req, res) => {
    try {
        const result = await solicitudesService.getSolicitudes(req.user.id);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo solicitudes' });
    }
};

// aceptar
const aceptarSolicitud = async (req, res) => {
    try {
        const result = await solicitudesService.aceptarSolicitud(
            Number(req.params.id),
            req.user.id
        );

        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// rechazar
const rechazarSolicitud = async (req, res) => {
    try{
        const result = await solicitudesService.rechazarSolicitud(req.user.id, req.params.id);
        res.json(result);
    } catch (error) {
        console.error('Error en rechazar Solicitud:', error);
        res.status(500).json({ error: `Error rechazando solicitud: ${error.message}` });
    }
};

module.exports = {
    createSolicitud,
    getSolicitudes,
    aceptarSolicitud,
    rechazarSolicitud
};