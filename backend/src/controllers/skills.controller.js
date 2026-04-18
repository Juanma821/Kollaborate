const skillsService = require('../services/skills.service');

//  CRUD

const getSkills = (req, res) => {
    res.json(skillsService.getSkills());
};

const createSkill = (req, res) => {
    const { name } = req.body;

    const skill = skillsService.createSkill(name);
    res.json(skill);
};

const updateSkill = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const skill = skillsService.updateSkill(id, name);

    if (!skill) {
        return res.status(404).json({ error: 'Skill no encontrada' });
    }

    res.json(skill);
};

const deleteSkill = (req, res) => {
    const { id } = req.params;

    const ok = skillsService.deleteSkill(id);

    if (!ok) {
        return res.status(404).json({ error: 'Skill no encontrada' });
    }

    res.json({ message: 'Skill eliminada' });
};

//  RELACIÓN

const addSkillOffer = (req, res) => {
    const userId = req.user.id;
    const skillId  = req.params.id;

    skillsService.addSkillOffer(userId, skillId);

    res.json({ message: 'Skill agregada como oferta' });
};

const addSkillWant = (req, res) => {
    const  userId = req.user.id;
    const skillId = req.params.id;

    skillsService.addSkillWant(userId, skillId);

    res.json({ message: 'Skill agregada como interés' });
};

module.exports = {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    addSkillOffer,
    addSkillWant
};