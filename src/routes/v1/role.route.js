const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const { roleController } = require('../../controllers');
const { roleValidation } = require('../../validations');
const { middelware } = require('../../middlewares/middleware');


router.post('/create', validate(roleValidation.createValidation), roleController.createRole);
router.get('/get', validate(roleValidation.getValidation), roleController.getRole);
router.put('/update/:_id', validate(roleValidation.updateValidation), roleController.updateRole);
router.delete('/delete/:_id', validate(roleValidation.deleteValidation), roleController.deleteRole);



module.exports = router;
