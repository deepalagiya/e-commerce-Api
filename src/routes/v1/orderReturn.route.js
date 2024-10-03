const express = require('express');
const router = express.Router();

const { middelware } = require('../../middlewares/middleware');
const { orderReturnController } = require('../../controllers');


router.post('/create', middelware(), orderReturnController.orderReturn);
router.get('/get', middelware(), orderReturnController.getOrderReturnData);

module.exports = router;