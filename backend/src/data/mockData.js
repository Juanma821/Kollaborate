const bcrypt = require('bcrypt');

const users = [
    {
        id: 1,
        email: 'test@test.com',
        password: bcrypt.hashSync('1234', 10),
        name: 'Test User'
    },
    {
        id: 2,
        email: 'user2@test.com',
        password: bcrypt.hashSync('1234', 10),
        name: 'User 2'
    }
];


let skills = [
    { id: 1, name: 'Ingles' },
    { id: 2, name: 'Matematicas' },
    { id: 3, name: 'Quimica' }
];

let userSkillsOffer = [];
let userSkillsWant = [];

let intercambios = [];

// Simulacion saldo con mockData
let tokens = [
    { userId: 1, saldo: 100 },
    { userId: 2, saldo: 100 }
];

let tokenTransactions = [];

module.exports = { users, skills, userSkillsOffer,
     userSkillsWant, intercambios, tokens, tokenTransactions };