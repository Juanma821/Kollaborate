const express = require('express');
const router = express.Router();

const {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    addSkillOffer,
    addSkillWant
} = require('../controllers/skills.controller');

// CRUD
router.get('/', getSkills);
router.post('/', createSkill);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);

// Relación usuario
router.post('/:id/offer', addSkillOffer);
router.post('/:id/want', addSkillWant);

module.exports = router;