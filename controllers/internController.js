const Intern = require('../models/Intern');
const { generateReferralCode } = require('../utils/generateReferralCode');

// Create (dummy) intern (for signup)
exports.createIntern = async (req, res, next) => {
  try {
    const { name, email, department } = req.body;
    const referralCode = generateReferralCode(name);
    const exists = await Intern.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const intern = await Intern.create({ name, email, department, referralCode });
    res.status(201).json(intern);
  } catch (err) { next(err); }
};

// "Login" (dummy – get by email)
exports.loginIntern = async (req, res, next) => {
  try {
    const { email } = req.body;
    const intern = await Intern.findOne({ email });
    if (!intern) return res.status(404).json({ message: "Intern not found" });
    res.json(intern);
  } catch (err) { next(err); }
};

// Get one by ID
exports.getIntern = async (req, res, next) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) return res.status(404).json({ message: "Intern not found" });
    res.json(intern);
  } catch (err) { next(err); }
};

exports.getAllInterns = async (req, res, next) => {
  try {
    const interns = await Intern.find();
    res.json(interns);
  } catch (err) { next(err); }
};

// You can use this for updating donations (demo bonus)
exports.updateDonations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { donationsRaised } = req.body;
    const intern = await Intern.findByIdAndUpdate(id, { donationsRaised }, { new: true });
    if (!intern) return res.status(404).json({ message: "Intern not found" });
    res.json(intern);
  } catch (err) { next(err); }
};
