const { tokens, tokenTransactions } = require('../data/mockData');

const getSaldo = (userId) => {
    const userToken = tokens.find(t => t.userId === userId);
    return userToken ? userToken.saldo : 0;
};

const transferir = (fromUserId, toUserId, amount) => {
    const from = tokens.find(t => t.userId === fromUserId);
    const to = tokens.find(t => t.userId === toUserId);

    if (!from || !to) return { error: 'Usuario no encontrado' };

    if (from.saldo < amount) {
        return { error: 'Saldo insuficiente' };
    }

    // actualizar saldos
    from.saldo -= amount;
    to.saldo += amount;

    // guardar historial
    tokenTransactions.push({
        id: tokenTransactions.length + 1,
        fromUserId,
        toUserId,
        amount,
        date: new Date()
    });

    return { message: 'Transferencia realizada' };
};

module.exports = {
    getSaldo,
    transferir
};