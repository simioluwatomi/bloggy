const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authenticationController');
const validateRegisterRequest = require('./../middlewares/registerUserValidator');
const validateLoginRequest = require('./../middlewares/loginUserValidator');


router.post('/auth/register', validateRegisterRequest, authController.register);
router.post('/auth/login', validateLoginRequest, authController.login);


module.exports = router;
