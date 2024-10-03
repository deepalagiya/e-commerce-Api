const express = require('express');
const { productController } = require('../../controllers');
const { middelware, roleBaseAuthoritiy } = require('../../middlewares/middleware');


const router = express.Router();

router.post('/create', middelware(), roleBaseAuthoritiy("product", "write"), productController.productCreate);
router.get('/get', middelware(true, false), productController.getAllProduct);
router.put('/update/:_id', productController.updateProductById);
router.delete('/delete/:_id', middelware(), productController.deleteProductById);
router.get('/search', productController.searchProduct);




module.exports = router;
