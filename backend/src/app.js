const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');

const app = express();

const userRoutes = require('./routes/user.routes');

const skillsRoutes = require('./routes/skills.routes');

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/skills', skillsRoutes);

module.exports = app;