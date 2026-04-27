const express = require('express');
const router = express.Router();

const { login, register, forgotPassword, resetPassword, logout } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);
router.post('/logout', verifyToken, logout);

module.exports = router;