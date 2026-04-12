const bcrypt = require('bcrypt');

const users = [
    {
        id: 1,
        email: 'test@test.com',
        password: bcrypt.hashSync('1234', 10),
        name: 'Test User'
    }
];

module.exports = { users };