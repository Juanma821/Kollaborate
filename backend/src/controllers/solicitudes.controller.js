const solicitudesService = require('../services/solicitudes.service');

// Crear solicitud
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
    console.log(' GET /solicitudes llamado por userId:', req.user.id);
    try {
        const result = await solicitudesService.getSolicitudes(req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo solicitudes recibidas' });
    }
};

// Obtener solicitudes ENVIADAS (Notificaciones)
const getSolicitudesEnviadas = async (req, res) => {
    try {
        const result = await solicitudesService.getSolicitudesEnviadas(req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo solicitudes enviadas' });
    }
};

// Obtener MATCHES/CHATS activos (Chats)
const getMatches = async (req, res) => {
    try {
        const result = await solicitudesService.getMatches(req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo matches' });
    }
};

// Obtener detalle de solicitud por ID
const getSolicitudById = async (req, res) => {
    try {
        const result = await solicitudesService.getSolicitudById(Number(req.params.id));
        if (!result) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo el detalle' });
    }
};

// Aceptar
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

// Rechazar
const rechazarSolicitud = async (req, res) => {
    try {
        const result = await solicitudesService.rechazarSolicitud(
            Number(req.params.id),
            req.user.id
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: `Error rechazando solicitud: ${error.message}` });
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