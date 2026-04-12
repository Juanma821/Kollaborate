const bcrypt = require('bcrypt');
const { users } = require('../data/mockData');

const login = async (email, password) => {
    const user = users.find(u => u.email === email);

    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return null;

    return user;
};

const register = async (email, password, name) => {
    const exists = users.find(u => u.email === email);

    if (exists) return null;

    const hashed = await bcrypt.hash(password, 10);

    const newUser = {
        id: users.length + 1,
        email,
        password: hashed,
        name
    }; 

    users.push(newUser);

    return newUser;
};

module.exports = { login, register };