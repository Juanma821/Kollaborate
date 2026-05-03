const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { getSessionHistory } = require('../controllers/record.controller');


router.get('/history', verifyToken, getSessionHistory);

module.exports = router;