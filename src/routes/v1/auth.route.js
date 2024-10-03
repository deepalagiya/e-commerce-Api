const express = require('express');
const router = express.Router();
const validate = require("../../middlewares/validate");
const { authValidation } = require('../../validations');
const { authController1 } = require('../../controllers');


router.post('/register', validate(authValidation.registerValidation), authController1.registration);
router.post('/login', validate(authValidation.login), authController1.login);
router.post('/forgotPassword', validate(authValidation.forgotPassword), authController1.forgotPassword);
router.post('/verifyOtp', validate(authValidation.verifyOtp), authController1.verifyOtp);
router.post('/resetPassword', validate(authValidation.resetPassword), authController1.resetPassword);



module.exports = router;