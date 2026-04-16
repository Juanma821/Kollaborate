const service = require('../services/intercambio.service');

const solicitar = (req, res) => {
    const intercambio = service.solicitar(req.body);
    res.json(intercambio);
};

const aceptar = (req, res) => {
    const intercambio = service.aceptar(req.params.id);

    if (!intercambio) {
        return res.status(404).json({ error: 'No encontrado' });
    }

    res.json(intercambio);
};

const rechazar = (req, res) => {
    const intercambio = service.rechazar(req.params.id);

    if (!intercambio) {
        return res.status(404).json({ error: 'No encontrado' });
    }

    res.json(intercambio);
};

const misSolicitudes = (req, res) => {
    const data = service.misSolicitudes(req.params.userId);
    res.json(data);
};

const solicitudesRecibidas = (req, res) => {
    const data = service.solicitudesRecibidas(req.params.userId);
    res.json(data);
};

module.exports = {
    solicitar,
    aceptar,
    rechazar,
    misSolicitudes,
    solicitudesRecibidas
};