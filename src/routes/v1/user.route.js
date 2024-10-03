const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const { userValidation } = require('../../validations');
const { userController } = require('../../controllers');

router.post('/create', validate(userValidation.createValidation), userController.createUser);
router.get('/get', userController.getUser);
router.put('/update/:_id', validate(userValidation.updateValidation), userController.updateUser);
router.delete('/delete/:_id', validate(userValidation.deleteValidation), userController.deleteUser);



module.exports = router;
