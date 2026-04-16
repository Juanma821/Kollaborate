const matchService = require('../services/match.service');

const getMatches = (req, res) => {
    const { id } = req.params;

    const matches = matchService.findMatches(id);

    res.json(matches);
};

module.exports = { getMatches };