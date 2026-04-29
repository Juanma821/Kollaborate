const mensajesService = require('../services/mensajes.service');

// Obtener historial mensajes
const getHistorial = async (req, res) => {
    try {
        const { sesionId } = req.params;
        const mensajes = await mensajesService.getMensajesBySesion(sesionId);
        res.json(mensajes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener mensajes" });
    }
};

// Enviar mensaje
const enviarMensaje = async (req, res) => {
    try {
        const { sesion_id, contenido } = req.body;
        const emisor_id = req.user.id;

        if (!contenido || contenido.trim() === "") {
            return res.status(400).json({ message: "El mensaje no puede estar vacío" });
        }

        await mensajesService.enviarMensaje(sesion_id, emisor_id, contenido);

        res.status(201).json({ message: "Mensaje enviado con éxito" });
    } catch (error) {
        console.error("Error al enviar mensaje:", error.message);
        res.status(500).json({ message: "No se pudo enviar el mensaje" });
    }
};

module.exports = {
    getHistorial,
    enviarMensaje
};