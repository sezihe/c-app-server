const express = require('express');

const { signup, signin } = require('../controllers/auth');
const { signUpValidator, signInValidator } = require('../validator');

const router = express.Router();

router.post('/signup', signUpValidator, signup);
router.post('/signin', signInValidator, signin);

module.exports = router;