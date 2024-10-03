const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const { orderValidation } = require('../../validations');
const { orderController } = require('../../controllers');
const { middelware } = require('../../middlewares/middleware');


router.post('/create', middelware(), validate(orderValidation.createValidation), orderController.createOrder);
router.get('/get', orderController.orderGet);
router.get('/orderDetailsDataGet', orderController.orderDetailsDataGet);
router.put('/update/:_id', validate(orderValidation.updateValidation), orderController.orderUpdate);
router.delete('/delete/:_id', validate(orderValidation.deleteValidation), orderController.orderDelete);
router.post('/image', orderController.paymentImage);

module.exports = router;