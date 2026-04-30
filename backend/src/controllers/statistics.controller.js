const statsService = require('../services/statistics.service');

const getStatistics = async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await statsService.getUserStatistics(userId);
        res.json(stats);
    } catch (error) {
        console.error("Error en Statistics Controller:", error.message);
        res.status(500).json({ error: 'No se pudieron cargar las estadísticas' });
    }
};

module.exports = { getStatistics };