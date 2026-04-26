const skillsService = require('../services/skills.service');

//  GET todas
const getSkills = async (req, res) => {
    try {
        const skills = await skillsService.getSkills();
        res.json(skills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener skills' });
    }
};

//  CREATE
const createSkill = async (req, res) => {
    try {
        const skill = await skillsService.createSkill(req.body);
        res.json(skill);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

//  UPDATE
const updateSkill = async (req, res) => {
    try {
        const skill = await skillsService.updateSkill(
            Number(req.params.id),
            req.body
        );

        if (!skill) {
            return res.status(404).json({ error: 'Skill no encontrada' });
        }

        res.json(skill);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar skill' });
    }
};

//  DELETE
const deleteSkill = async (req, res) => {
    try {
        const result = await skillsService.deleteSkill(Number(req.params.id));

        if (!result) {
            return res.status(404).json({ error: 'Skill no encontrada' });
        }

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar skill' });
    }
};

//  Usuario OFRECE skill
const addSkillOffer = async (req, res) => {
    try {
        const result = await skillsService.addSkillToUser({
            usuario_id: req.user.id,
            habilidad_id: Number(req.params.id),
            tipo: 'Ofrece'
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

//  Usuario BUSCA skill
const addSkillWant = async (req, res) => {
    try {
        const result = await skillsService.addSkillToUser({
            usuario_id: req.user.id,
            habilidad_id: Number(req.params.id),
            tipo: 'Busca'
        });

        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    addSkillOffer,
    addSkillWant
};