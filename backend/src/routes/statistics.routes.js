const express = require('express');
const router = express.Router();
const { getStatistics } = require('../controllers/statistics.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, getStatistics);

module.exports = router;