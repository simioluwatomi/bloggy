const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authenticationController');
const validateRegisterRequest = require('./../middlewares/registerUserValidator');
const validateLoginRequest = require('./../middlewares/loginUserValidator');
const validateInitiatePasswordResetRequest = require('../middlewares/requestPasswordResetValidator');
const validateCompletePasswordResetRequest = require('../middlewares/completePasswordResetValidator');

router.post('/auth/register', validateRegisterRequest, authController.register);
router.post('/auth/login', validateLoginRequest, authController.login);
router.post('/auth/passwords/reset', validateInitiatePasswordResetRequest, authController.requestPasswordReset);
router.patch('/auth/passwords/reset', validateCompletePasswordResetRequest, authController.completePasswordReset);

module.exports = router;
