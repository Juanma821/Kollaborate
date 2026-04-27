const skillsService = require('../services/skills.service');


// =========================
// GET ALL SKILLS
// =========================
const getSkills = async (req, res) => {
    try {
        const skills = await skillsService.getSkills();
        res.json(skills);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener skills' });
    }
};


// =========================
// CREATE SKILL
// =========================
const createSkill = async (req, res) => {
    try {
        const skill = await skillsService.createSkill(req.body);
        res.json(skill);

    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};


// =========================
// UPDATE SKILL
// =========================
const updateSkill = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const skill = await skillsService.updateSkill(id, req.body);

        res.json(skill);

    } catch (error) {
        console.error(error.message);

        const status = error.message.includes('no encontrada') ? 404 : 400;

        res.status(status).json({ error: error.message });
    }
};


// =========================
// DELETE SKILL
// =========================
const deleteSkill = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const result = await skillsService.deleteSkill(id);

        res.json(result);

    } catch (error) {
        console.error(error.message);

        const status = error.message.includes('no encontrada') ? 404 : 400;

        res.status(status).json({ error: error.message });
    }
};



// ADD SKILL (OFRECE)
// =========================
const addSkillOffer = async (req, res) => {
    try {
        const habilidadId = Number(req.params.id);
        if (isNaN(habilidadId)) {
            return res.status(400).json({ error: 'ID de habilidad inválido' });
        }

        const result = await skillsService.addSkillToUser({
            usuario_id: req.user.id,
            habilidad_id: habilidadId,
            tipo: 'Ofrece'
        });

        res.json(result);

    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};


// =========================
// ADD SKILL (BUSCA)
// =========================
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