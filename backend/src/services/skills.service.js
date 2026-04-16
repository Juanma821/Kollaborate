const { skills, userSkillsOffer, userSkillsWant } = require('../data/mockData');

//  CRUD SKILLS

const getSkills = () => {
    return skills;
};

const createSkill = (name) => {
    const newSkill = {
        id: skills.length + 1,
        name
    };
    skills.push(newSkill);
    return newSkill;
};

const updateSkill = (id, name) => {
    const skill = skills.find(s => s.id === parseInt(id));
    if (!skill) return null;

    skill.name = name;
    return skill;
};

const deleteSkill = (id) => {
    const index = skills.findIndex(s => s.id === parseInt(id));
    if (index === -1) return false;

    skills.splice(index, 1);
    return true;
};

//  RELACIÓN USUARIO - SKILLS

const addSkillOffer = (userId, skillId) => {
    userSkillsOffer.push({
        userId: parseInt(userId),
        skillId: parseInt(skillId)
    });
    return true;
};

const addSkillWant = (userId, skillId) => {
    userSkillsWant.push({
        userId: parseInt(userId),
        skillId: parseInt(skillId)
    });
    return true;
};

module.exports = {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    addSkillOffer,
    addSkillWant
};