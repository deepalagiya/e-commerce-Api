const express = require('express');
const { middelware } = require('../../middlewares/middleware');
const { categoryController } = require('../../controllers');
const router = express.Router();

router.post('/create', middelware(), categoryController.categoryCreate);
router.get('/get', categoryController.gateCategory);
router.put('/update/:_id', categoryController.updateCategory);
router.delete('/delete/:_id', categoryController.daleteCategory);




module.exports = router;
