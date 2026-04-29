const jwt = require('jsonwebtoken');

// VERIFY TOKEN
// =========================
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('🔐 Authorization header:', authHeader);

    // Validación segura del header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Token requerido o formato inválido' });
    }

    const token = authHeader.slice(7).trim(); // elimina "Bearer "

    if (!token) {
        return res.status(403).json({ error: 'Token requerido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Normalizar usuario en request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            rol: decoded.rol
        };

        next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }

        return res.status(401).json({ error: 'Token inválido' });
    }
};


// IS OWNER
// =========================
const isOwner = (req, res, next) => {
    const paramId = Number(req.params.id);

    if (isNaN(paramId)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    // (opcional pro) admin puede pasar igual
    if (req.user.rol === 'admin') {
        return next();
    }

    if (req.user.id !== paramId) {
        return res.status(403).json({ error: 'No autorizado' });
    }

    next();
};


// HAS ROLE
// =========================
const hasRole = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        next();
    };
};

module.exports = {
    verifyToken,
    isOwner,
    hasRole
};