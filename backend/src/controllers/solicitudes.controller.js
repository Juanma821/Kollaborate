const solicitudesService = require('../services/solicitudes.service');

const createSolicitud = async (req, res) => {
    try {
        const result = await solicitudesService.createSolicitud({
            solicitante_id: req.user.id,
            receptor_id: req.body.receptor_id,
            habilidad_id: req.body.habilidad_id,
            modalidad: req.body.modalidad,
            tokens_recompensa: req.body.tokens_recompensa,
            nivel: req.body.nivel,
            fecha_propuesta: req.body.fecha_propuesta
        });
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getSolicitudesRecibidas = async (req, res) => {
    try {
        const solicitudes = await solicitudesService.getSolicitudes(req.user.id);
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener solicitudes recibidas' });
    }
};

const getSolicitudesEnviadas = async (req, res) => {
    try {
        const solicitudes = await solicitudesService.getSolicitudesEnviadas(req.user.id);
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener solicitudes enviadas' });
    }
};

const getMatches = async (req, res) => {
    try {
        const result = await solicitudesService.getMatches(req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo matches' });
    }
};

const getSolicitudById = async (req, res) => {
    try {
        const result = await solicitudesService.getSolicitudById(Number(req.params.id));
        if (!result) return res.status(404).json({ error: 'Solicitud no encontrada' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo el detalle' });
    }
};

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

const rechazarSolicitud = async (req, res) => {
    try {
        const result = await solicitudesService.rechazarSolicitud(
            Number(req.params.id),
            req.user.id
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createSolicitud,
    getSolicitudesRecibidas,
    getSolicitudesEnviadas,
    getMatches,
    aceptarSolicitud,
    rechazarSolicitud,
    getSolicitudById
};