const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
// const bcrypt = require('bcrypt');
// const dotenv = require('dotenv').config();
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');

router.get('/', function(req, res, next) {
  res.send("<h1>auth</h1>")
});

module.exports = router;
