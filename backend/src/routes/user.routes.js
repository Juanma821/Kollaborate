const express = require('express');
const router = express.Router();

const { getUser, updateUser } = require('../controllers/user.controller');
const { verifyToken, isOwner } = require('../middlewares/auth.middleware');

router.get('/:id', verifyToken, isOwner, getUser);
router.put('/:id', verifyToken, isOwner, updateUser);

module.exports = router;