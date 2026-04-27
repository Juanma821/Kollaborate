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
    deleteUserSkill  
} = require('../controllers/skills.controller');

router.get('/search', searchSkills);
router.get('/', getSkills);

// Cargar tags
router.get('/user', verifyToken, getUserSkills); 

// Añadir habilidades (Pagina habilidades)
router.post('/:id/offer', verifyToken, addSkillOffer);
router.post('/:id/want', verifyToken, addSkillWant);

// Borrar habilidad (Tag)
router.delete('/:id/:type', verifyToken, deleteUserSkill); 

// CRUD Protegido
router.post('/', verifyToken, createSkill);
router.put('/:id', verifyToken, updateSkill);
router.delete('/:id', verifyToken, deleteSkill);

module.exports = router;