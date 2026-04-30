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

const finalizarSesion = async (req, res) => {
  try {
    const result = await sesionesService.finalizarSesion(
      Number(req.params.id),
      req.user.id
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const cancelarSesion = async (req, res) => {
  try {
    const result = await sesionesService.cancelarSesion(
      Number(req.params.id),
      req.user.id
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getSesiones, finalizarSesion, cancelarSesion };