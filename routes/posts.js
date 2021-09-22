const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
const PostModel = require('../models/postModel');
// const jwt = require('jsonwebtoken');
const Imgbb = require('imgbbjs');
const imgbb = new Imgbb({
  key: process.env.IMGBB_API_TOKEN,
});
// get
// get a post
router.get('/:_id', async (req,res)=>{
    try {
        const post = await PostModel.findById(req.params._id)
        res.status(200).send({
            post,
            messages:"Post displayed"
        })
    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router;
