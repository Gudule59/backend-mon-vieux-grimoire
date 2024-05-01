const express = require('express');
const router = express.Router();
const userCtrl = require('../Controllers/user');

// Routes pour les utilisateurs
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
