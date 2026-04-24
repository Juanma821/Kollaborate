const jwt = require('jsonwebtoken');

//  Verifica el token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ error: 'Token requerido' });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Formato inválido' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'Token requerido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Guardamos la info del usuario en la request
        req.user = decoded;

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }

        return res.status(401).json({ error: 'Token inválido' });
    }
};

//  Verifica que el usuario sea dueño del recurso
const isOwner = (req, res, next) => {
    if (!req.user || req.user.id !== Number(req.params.id)) {
        return res.status(403).json({ error: 'No autorizado' });
    }

    next();
};

module.exports = {
    verifyToken,
    isOwner
};