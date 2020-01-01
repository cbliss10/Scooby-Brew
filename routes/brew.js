const path = require('path');

const express = require('express');

const brewController = require('../controllers/brew');

const router = express.Router();

router.get('/', brewController.getBrew);

module.exports = router;