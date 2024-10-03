const express = require('express');
const { middelware } = require('../../middlewares/middleware');
const { Product_detailsController } = require('../../controllers');
const router = express.Router();

router.post('/create', middelware(), Product_detailsController.productCreate);
router.get('/get', Product_detailsController.getAllProduct);
router.put('/update/:_id', Product_detailsController.updateProductById);
router.delete('/delete/:_id', Product_detailsController.deleteProductById);




module.exports = router;
