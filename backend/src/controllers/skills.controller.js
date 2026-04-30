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

// =========================
// SEARCH SKILLS (Autocompletado)
// =========================
const searchSkills = async (req, res) => {
    try {
        const query = req.query.q;
        console.log("🔍 Buscando en BD:", query);

        if (!query) return res.json([]);

        const skills = await skillsService.searchSkills(query);
        res.json(skills);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar habilidades' });
    }
};

// =========================
// DELETE USER SKILL (La "X" del tag)
// =========================
const deleteUserSkill = async (req, res) => {
    try {
        const habilidadId = Number(req.params.id);
        const tipoUrl = req.params.type; 
        const usuarioId = req.user.id;

        let tipoParaBD;
        if (tipoUrl === 'offer' || tipoUrl === 'ofrezco' || tipoUrl === 'Ofrece') {
            tipoParaBD = 'Ofrece';
        } else {
            tipoParaBD = 'Busca';
        }

        const result = await skillsService.removeSkillFromUser(usuarioId, habilidadId, tipoParaBD);
        res.json(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// =========================
// GET USER SKILLS (Cargar tag)
// =========================
const getUserSkills = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const skills = await skillsService.getUserSkills(usuarioId);
        res.json(skills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener habilidades del usuario' });
    }
};

const getSkillsByCategoria = async (req, res) => {
    try {
        const result = await skillsService.getSkillsByCategoria();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
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
};