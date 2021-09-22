const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
const PostModel = require('../models/postModel');
// const jwt = require('jsonwebtoken');
const Imgbb = require('imgbbjs');
const imgbb = new Imgbb({
  key: process.env.IMGBB_API_TOKEN,
});

router.get('/', function(req, res, next) {
  res.send("<h1>post</h1>")
});


module.exports = router;
