const express = require('express');
const router = express.Router();

const { getMatches, getMatchProfile } = require('../controllers/match.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, getMatches);
router.get('/:id', verifyToken, getMatchProfile);

module.exports = router;
