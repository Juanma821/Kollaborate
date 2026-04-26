const express = require('express');
const router = express.Router();

const { getUser, updateUser, changePassword } = require('../controllers/user.controller');
const { verifyToken, isOwner } = require('../middlewares/auth.middleware');

router.put('/change-password', verifyToken, changePassword);

router.get('/:id', verifyToken, isOwner, getUser);
router.put('/:id', verifyToken, isOwner, updateUser);


//router.put('/:id', updateUser); //Utilizar esta línea para pruebas sin autenticación
module.exports = router;