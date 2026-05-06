const tokensService = require('../services/tokens.service');

const getSaldo = async (req, res) => {
    try {
        const result = await tokensService.getSaldo(req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHistorial = async (req, res) => {
    try {
        const historial = await tokensService.getHistorial(req.user.id);
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginDiario = async (req, res) => {
    try {
        const result = await tokensService.loginDiario(req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getSaldo, getHistorial, loginDiario };