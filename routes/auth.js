require('dotenv').config();
const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("<h1>auth</h1>")
});

module.exports = router;
