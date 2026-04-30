const matchService = require('../services/match.service');

const getMatches = async (req, res) => {
    try {
        const categoria = req.query.categoria || null;
        const result = await matchService.getMatches(req.user.id, categoria);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo matches' });
    }
};

const getMatchProfile = async (req, res) => {
    try {
        const profile = await matchService.getMatchProfileById(Number(req.params.id));

        if (!profile) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo perfil del usuario' });
    }
};

module.exports = { getMatches, getMatchProfile };
