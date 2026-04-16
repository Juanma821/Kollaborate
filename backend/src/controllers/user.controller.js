const userService = require('../services/user.service');

const getUser = (req, res) => {
    const { id } = req.params;

    const user = userService.getUserById(id);

    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
        id: user.id,
        email: user.email,
        name: user.name
    });
};

const updateUser = (req, res) => {
    const { id } = req.params;

    const user = userService.updateUser(id, req.body);

    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
        id: user.id,
        email: user.email,
        name: user.name
    });
};

module.exports = { getUser, updateUser };