const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const app = express();
const userRoutes = require('./routes/user.routes');
const skillsRoutes = require('./routes/skills.routes');
const matchRoutes = require('./routes/match.routes');
//const tokenRoutes = require('./routes/token.routes');
const solicitudesRoutes = require('./routes/solicitudes.routes');
const institutionRoutes = require('./routes/institution.routes');
const mensajesRoutes = require('./routes/mensajes.routes');
const sesionesRoutes = require('./routes/sesiones.routes');
const statisticsRoutes = require('./routes/statistics.routes');
const recordRoutes = require('./routes/record.routes');
const tokenRoutes = require('./routes/token.routes');

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/skills', skillsRoutes);

app.use('/api/match', matchRoutes);

//app.use('/api/tokens', tokenRoutes);

app.use('/api/solicitudes', solicitudesRoutes);

app.use('/api/sesiones', sesionesRoutes);

app.use('/api/institutions', institutionRoutes);

app.use('/api/mensajes', mensajesRoutes);

app.use('/api/statistics', statisticsRoutes);

app.use('/api/records', recordRoutes);

app.use('/api/tokens', tokenRoutes);

module.exports = app;