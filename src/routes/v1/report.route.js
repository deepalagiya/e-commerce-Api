const express = require('express');
const { middelware } = require('../../middlewares/middleware');
const { reportController } = require('../../controllers');
const router = express.Router();

router.get('/productWiseReport', reportController.productWiseReport);
router.get('/categoryWiseReport', reportController.categoryWiseReport);
router.get('/last_3month_selling', reportController.last_3month_selling);


module.exports = router;
