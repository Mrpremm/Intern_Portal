const Intern = require('../models/Intern');

exports.getLeaderboard = async (req, res, next) => {
  try {
    // Sort interns by donationsRaised DESC
    const leaderboard = await Intern.find().sort({ donationsRaised: -1 });
    res.json(leaderboard);
  } catch (err) { next(err); }
};
