const sesionesService = require('../services/sesiones.service');

const getSesiones = async (req, res) => {
  try {
    const result = await sesionesService.getSesiones(req.user.id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo sesiones' });
  }
};

module.exports = { getSesiones };