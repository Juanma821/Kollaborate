const service = require('../services/incidencias.service');

const postReporte = async (req, res) => {
    try {
        const { sesion_id, tipo_incidencia, descripcion, prioridad } = req.body;
        const usuarioReportaId = req.user.id;

        const result = await service.crearIncidencia(
            sesion_id, 
            usuarioReportaId, 
            tipo_incidencia, 
            descripcion, 
            prioridad
        );
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "No se pudo registrar la incidencia" });
    }
};

module.exports = { postReporte };