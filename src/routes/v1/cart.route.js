const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const { cartValidation, roleValidation } = require('../../validations');
const { cartController, roleController } = require('../../controllers');
const { middelware } = require('../../middlewares/middleware');



router.post('/create', middelware(true, false), validate(cartValidation.createValidation), cartController.createCart);
router.get('/get', middelware(true, false), cartController.getCart);
router.put('/update/:_id', validate(cartValidation.updateValidation), cartController.updateCart);
router.delete('/delete/:_id', validate(cartValidation.deleteValidation), cartController.deleteCart);

module.exports = router;