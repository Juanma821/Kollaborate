const { intercambios } = require('../data/mockData');

const solicitar = (data) => {
    const newId = intercambios.length > 0
        ? Math.max(...intercambios.map(i => i.id)) + 1
        : 1;

    const nuevo = {
        id: newId,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        skillOffered: data.skillOffered,
        skillWanted: data.skillWanted,
        status: 'pendiente'
    };

    intercambios.push(nuevo);
    return nuevo;
};

const aceptar = (id) => {
    const intercambio = intercambios.find(i => i.id === parseInt(id));
    if (!intercambio) return null;

    intercambio.status = 'aceptado';
    return intercambio;
};

const rechazar = (id) => {
    const intercambio = intercambios.find(i => i.id === parseInt(id));
    if (!intercambio) return null;

    intercambio.status = 'rechazado';
    return intercambio;
};

const misSolicitudes = (userId) => {
    return intercambios.filter(i => i.fromUserId === parseInt(userId));
};

const solicitudesRecibidas = (userId) => {
    return intercambios.filter(i => i.toUserId === parseInt(userId));
};

module.exports = {
    solicitar,
    aceptar,
    rechazar,
    misSolicitudes,
    solicitudesRecibidas
};