const db = require('../db');

// Registrar transacción
const registrarTransaccion = async (connection, { sesion_id = null, emisor_id, receptor_id, monto, tipo, concepto }) => {
    await connection.execute(
        `INSERT INTO transacciones (sesion_id, emisor_id, receptor_id, monto, tipo, concepto, fecha)
         VALUES (:sesion_id, :emisor_id, :receptor_id, :monto, :tipo, :concepto, CURRENT_TIMESTAMP)`,
        { sesion_id, emisor_id, receptor_id, monto, tipo, concepto }
    );
};

// Obtener saldo actual
const getSaldo = async (userId) => {
    let connection;
    try {
        connection = await db.getConnection();
        const result = await connection.execute(
            `SELECT saldo_tokens, streak_dias FROM usuarios WHERE id = :id`,
            { id: userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );
        console.log('getSaldo result:', JSON.stringify(result.rows[0]));
        return {
            saldo: result.rows[0]?.SALDO_TOKENS || 0,
            streakDias: result.rows[0]?.STREAK_DIAS || 0
        };
    } finally {
        if (connection) await connection.close();
    }
};

// Obtener historial de transacciones
const getHistorial = async (userId) => {
    let connection;
    try {
        connection = await db.getConnection();
        const result = await connection.execute(
            `SELECT t.id, t.monto, t.tipo, t.concepto, t.fecha,
                    u1.nombre AS emisor, u2.nombre AS receptor
             FROM transacciones t
             JOIN usuarios u1 ON u1.id = t.emisor_id
             JOIN usuarios u2 ON u2.id = t.receptor_id
             WHERE t.emisor_id = :id OR t.receptor_id = :id
             ORDER BY t.fecha DESC`,
            { id: userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        return result.rows.map(row => ({
            id: row.ID,
            monto: row.MONTO,
            tipo: row.TIPO,
            concepto: row.CONCEPTO,
            fecha: row.FECHA,
            emisor: row.EMISOR,
            receptor: row.RECEPTOR,
        }));
    } finally {
        if (connection) await connection.close();
    }
};

// Login diario + streak
const loginDiario = async (userId) => {
    let connection;
    try {
        connection = await db.getConnection();

        const result = await connection.execute(
            `SELECT ultimo_login, streak_dias, saldo_tokens FROM usuarios WHERE id = :id`,
            { id: userId },
            { outFormat: db.oracledb.OUT_FORMAT_OBJECT }
        );

        const user = result.rows[0];
        const hoy = new Date();
        const ultimoLogin = user.ULTIMO_LOGIN ? new Date(user.ULTIMO_LOGIN) : null;

        // Comparar solo fecha sin hora para evitar problemas de timezone
        const hoyStr = hoy.toISOString().split('T')[0];
        const ultimoLoginStr = ultimoLogin ? ultimoLogin.toISOString().split('T')[0] : null;

        const yaLogueoHoy = hoyStr === ultimoLoginStr;

        console.log('hoyStr:', hoyStr);
        console.log('ultimoLoginStr:', ultimoLoginStr);
        console.log('yaLogueoHoy:', yaLogueoHoy);

        if (yaLogueoHoy) {
            return {
                tokensGanados: 0,
                streakDias: user.STREAK_DIAS || 0,
                bonusStreak: false,
                mensaje: 'Ya reclamaste tu recompensa hoy'
            };
        }

        // Calcular streak
        const ayer = new Date(hoy);
        ayer.setDate(ayer.getDate() - 1);
        const ayerStr = ayer.toISOString().split('T')[0];

        const loginFueAyer = ultimoLoginStr === ayerStr;

        let nuevoStreak = loginFueAyer ? (user.STREAK_DIAS || 0) + 1 : 1;
        if (nuevoStreak > 7) nuevoStreak = 1;

        // Calcular tokens
        let tokensGanados = 10;
        let bonusStreak = false;

        if (nuevoStreak === 7) {
            tokensGanados += 20;
            bonusStreak = true;
        }

        const nuevoSaldo = (user.SALDO_TOKENS || 0) + tokensGanados;

        // Actualizar usuario
        await connection.execute(
            `UPDATE usuarios SET 
                saldo_tokens = :saldo,
                ultimo_login = SYSDATE,
                streak_dias = :streak
             WHERE id = :id`,
            { saldo: nuevoSaldo, streak: nuevoStreak, id: userId }
        );

        // Registrar transacción
        await registrarTransaccion(connection, {
            emisor_id: userId,
            receptor_id: userId,
            monto: tokensGanados,
            tipo: 'ingreso',
            concepto: bonusStreak ? 'bonus_streak_7dias' : 'login_diario'
        });

        await connection.commit();

        return {
            tokensGanados,
            streakDias: nuevoStreak,
            bonusStreak,
            nuevoSaldo,
            mensaje: bonusStreak
                ? `🔥 ¡Streak de 7 días! +${tokensGanados} tokens`
                : `+${tokensGanados} tokens por login diario`
        };

    } finally {
        if (connection) await connection.close();
    }
};

module.exports = { getSaldo, getHistorial, loginDiario, registrarTransaccion };