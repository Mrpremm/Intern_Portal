const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String },
  joinDate: { type: Date, default: Date.now },
  referralCode: { type: String, required: true, unique: true },
  donationsRaised: { type: Number, default: 0 }
});

module.exports = mongoose.model('Intern', internSchema);
