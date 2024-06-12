const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authenticationController');
const validateRegisterRequest = require('./../middlewares/registerUserValidator');
const validateLoginRequest = require('./../middlewares/loginUserValidator');
const validateInitiatePasswordResetRequest = require('../middlewares/requestPasswordResetValidator');

router.post('/auth/register', validateRegisterRequest, authController.register);
router.post('/auth/login', validateLoginRequest, authController.login);
router.post('/auth/passwords/reset', validateInitiatePasswordResetRequest, authController.requestPasswordReset);

module.exports = router;
