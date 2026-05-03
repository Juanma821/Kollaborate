const tokenService = require('../services/token.service');

const getWalletInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const { filter } = req.query;

        if (!filter) {
            return res.status(400).json({ message: "El filtro es requerido" });
        }

        const data = await tokenService.getTokenData(userId, filter);
        res.json(data);
    } catch (error) {
        console.error("Error en TokenController:", error);
        res.status(500).json({ message: "Error al obtener el estado de cuenta" });
    }
};

module.exports = { getWalletInfo };