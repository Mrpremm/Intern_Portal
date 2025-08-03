const express = require('express');
const router = express.Router();
const Reward = require('../models/Reward');

// All rewards (static or pre-seeded)
router.get('/', async (req, res) => {
  const rewards = await Reward.find();
  res.json(rewards);
});

module.exports = router;
