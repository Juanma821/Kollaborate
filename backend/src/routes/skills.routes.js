const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');

const {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    addSkillOffer,
    addSkillWant
} = require('../controllers/skills.controller');


router.get('/', getSkills);
// CRUD Protegido
router.post('/', verifyToken, createSkill);
router.put('/:id', verifyToken, updateSkill);
router.delete('/:id', verifyToken, deleteSkill);

// Relación usuario
router.post('/:id/offer', verifyToken, addSkillOffer);
router.post('/:id/want', verifyToken, addSkillWant);


module.exports = router;