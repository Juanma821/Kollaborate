const userService = require('../services/user.service');

const getUser = async (req, res) => {
    const user = await userService.getUserById(Number(req.params.id));

    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
};

const updateUser = async (req, res) => {
    const user = await userService.updateUser(Number(req.params.id), req.body);

    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
};

module.exports = { getUser, updateUser };