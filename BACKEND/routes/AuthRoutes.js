const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/verify', authController.confirm);
router.post('/resend', authController.resendConfirmationCode);

module.exports = router;
