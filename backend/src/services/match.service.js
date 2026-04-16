const { userSkillsOffer, userSkillsWant, users, skills } = require('../data/mockData');

const findMatches = (userId) => {
    userId = parseInt(userId);

    const myWants = userSkillsWant.filter(u => u.userId === userId);

    let matches = [];

    myWants.forEach(want => {
        userSkillsOffer.forEach(offer => {

            if (offer.skillId === want.skillId && offer.userId !== userId) {

                const user = users.find(u => u.id === offer.userId);
                const skill = skills.find(s => s.id === want.skillId);

                if (user && skill){
                    matches.push({
                        userId: user.id,
                        name: user.name,
                        skill: skill.name
                    });
                }
            }

        });
    });

    return matches;
};

module.exports = { findMatches };