const express = require('express');
const router = express.Router();
const { getWalletInfo } = require('../controllers/token.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/wallet', verifyToken, getWalletInfo);

module.exports = router;