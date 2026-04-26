const institutionService = require('../services/institution.service');

const getAllInstitutions = async (req, res) => {
    try {
        const institutions = await institutionService.getAllInstitutions();

        if (!institutions || institutions.length === 0) {
            return res.status(200).json([]);
        }

        res.json(institutions);

    } catch (error) {
        console.error('Error en institutionController:', error);
        res.status(500).json({ error: 'Error al obtener el listado de instituciones' });
    }
};

module.exports = {
    getAllInstitutions
};