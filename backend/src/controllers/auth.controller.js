const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');


// =========================
// LOGIN
// =========================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await authService.login(email, password);

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido,
                alias: user.alias,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el login' });
    }
};


// =========================
// REGISTER
// =========================
const register = async (req, res) => {
    try {
        const { email, password, nombre, apellido, alias } = req.body;

        const user = await authService.register(
            email,
            password,
            nombre,
            apellido,
            alias
        );

        if (!user) {
            return res.status(400).json({ error: 'Usuario ya existe o alias en uso' });
        }

        return res.json({
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            apellido: user.apellido,
            alias: user.alias,
            rol: user.rol || 'estudiante'
        });

    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};

module.exports = { login, register };