const matchService = require('../services/match.service');

const getMatches = async (req, res) => {
    try {
        const userId = req.user.id;
        const matches = await matchService.getMatches(userId);
        res.json(matches);
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
