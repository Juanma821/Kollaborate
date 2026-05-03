const recordService = require('../services/record.service');

const getSessionHistory = async (req, res) => {
    try {
        const { filter } = req.query;
        const userId = req.user.id; 

        if (!filter) {
            return res.status(400).json({ message: "El filtro es requerido" });
        }

        const history = await recordService.getHistory(userId, filter);
        
        res.json(history);
    } catch (error) {
        console.error("Error en RecordController:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = {
    getSessionHistory
};