const { users } = require('../data/mockData');

const getUserById = (id) => {
    return users.find(u => u.id === parseInt(id));
};

const updateUser = (id, data) => {
    const user = users.find(u => u.id === parseInt(id));

    if (!user) return null;

    user.name = data.name || user.name;
    user.email = data.email || user.email;

    return user;
};

module.exports = { getUserById, updateUser };