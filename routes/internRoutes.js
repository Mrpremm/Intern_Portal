const express = require('express');
const router = express.Router();
const internController = require('../controllers/internController');

// Dummy (no auth) login/signup
router.post('/signup', internController.createIntern);
router.post('/login', internController.loginIntern);
router.get('/:id', internController.getIntern);
router.put('/:id/donations', internController.updateDonations);

router.get('/', internController.getAllInterns);

module.exports = router;
