const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authenticationController');
const validateRegisterRequest = require('./../middlewares/registerUserValidator');

router.post('/auth/register', validateRegisterRequest, authController.register);

module.exports = router;
