const tokenService = require('../services/token.service');

const getSaldo = (req, res) => {
    const userId = req.user.id;

    const saldo = tokenService.getSaldo(userId);

    res.json({ saldo });
};

const transferir = (req, res) => {
    const fromUserId = req.user.id;
    const { toUserId, amount } = req.body;

    const result = tokenService.transferir(fromUserId, toUserId, amount);

    if (result.error) {
        return res.status(400).json(result);
    }

    res.json(result);
};

module.exports = {
    getSaldo,
    transferir
};