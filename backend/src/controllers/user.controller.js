const userService = require('../services/user.service');

const getUser = async (req, res) => {
    try{
        const user = await userService.getUserById(Number(req.params.id));

        if (!user) {
             return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user);

    } catch (error){
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

const updateUser = async (req, res) => {
    try{
        const user = await userService.updateUser(Number(req.params.id), req.body);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user);
        
    } catch (error){
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

module.exports = { getUser, updateUser };