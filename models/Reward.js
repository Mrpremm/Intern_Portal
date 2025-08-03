const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  title: String,
  description: String,
  threshold: Number,
  icon: String,
});

module.exports = mongoose.model('Reward', rewardSchema);
