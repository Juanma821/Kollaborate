const express = require('express');
const router = express.Router();

const { getMatches } = require('../controllers/match.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, getMatches);

module.exports = router;