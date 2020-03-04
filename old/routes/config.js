const path = require('path');

const express = require('express');

const configController = require('../controllers/config');

const router = express.Router();

router.get('/', configController.getConfig);
router.get('/getData', configController.getData);

module.exports = router;