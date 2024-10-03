const express = require('express');
const { permitionController } = require('../../controllers');
const router = express.Router();




router.post('/create', permitionController.createPermitionByName);



module.exports = router;