const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const Imgbb = require('imgbbjs');
// const imgbb = new Imgbb({
//   key: process.env.IMGBB_API_TOKEN,
// });

// get all users
router.get('/', async (req, res) => {
    try {
      const list = await UserModel.find()
      res.send({
          list,
          message:"Users list"
      });
    } catch (error) {
      res.status(500).send(error);
    }
});

module.exports = router;
