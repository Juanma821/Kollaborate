const matchService = require('../services/match.service');

const getMatches = async (req, res) => {
    try {
        const userId = req.user.id; // del JWT

        const matches = await matchService.getMatches(userId);

        res.json(matches);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo matches' });
    }
};

module.exports = { getMatches };