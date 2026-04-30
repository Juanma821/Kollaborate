const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    addSkillOffer,
    addSkillWant,
    searchSkills,
    getUserSkills,
    deleteUserSkill,
    getSkillsByCategoria  
} = require('../controllers/skills.controller');

router.get('/search', searchSkills);
router.get('/by-categoria', getSkillsByCategoria); 
router.get('/user', verifyToken, getUserSkills);
router.get('/', getSkills);

router.post('/:id/offer', verifyToken, addSkillOffer);
router.post('/:id/want', verifyToken, addSkillWant);
router.delete('/:id/:type', verifyToken, deleteUserSkill);

router.post('/', verifyToken, createSkill);
router.put('/:id', verifyToken, updateSkill);
router.delete('/:id', verifyToken, deleteSkill);

module.exports = router;