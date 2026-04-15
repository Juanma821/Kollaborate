const bcrypt = require('bcrypt');

const users = [
    {
        id: 1,
        email: 'test@test.com',
        password: bcrypt.hashSync('1234', 10),
        name: 'Test User'
    }
];


let skills = [
    { id: 1, name: 'Ingles' },
    { id: 2, name: 'Matematicas' },
    { id: 3, name: 'Quimica' }
];

let userSkillsOffer = [];
let userSkillsWant = [];

module.exports = { users, skills, userSkillsOffer, userSkillsWant };