const resenasService = require('../services/resenas.service');

const crearResena = async (req, res) => {
    try {
        const result = await resenasService.crearResena({
            sesion_id: Number(req.body.sesion_id),
            evaluador_id: req.user.id,
            evaluado_id: Number(req.body.evaluado_id),
            calificacion: Number(req.body.calificacion),
            comentario: req.body.comentario || null,
        });
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getResenasByUsuario = async (req, res) => {
    try {
        const result = await resenasService.getResenasByUsuario(Number(req.params.userId));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPromedioByUsuario = async (req, res) => {
    try {
        const result = await resenasService.getPromedioByUsuario(Number(req.params.userId));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { crearResena, getResenasByUsuario, getPromedioByUsuario };