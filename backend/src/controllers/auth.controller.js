const { error } = require('selenium-webdriver');
const authService = require('../services/auth.service');

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await authService.login(email, password);

    if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.json({
        id: user.id,
        email: user.email,
        name: user.name});
};
const register = async(req, res) =>{
    const{email, password, name } = req.body;
    
    const user = await authService.register(email, password, name);

    if (!user){
        return res.status(400).json({error: 'Usuario ya existe'});
    }

    res.json({
        id: user.id,
        email: user.email,
        name: user.name
    });
}

module.exports = { login, register };