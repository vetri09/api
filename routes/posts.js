const express = require('express');
const router = express.Router();
const PostModel = require('../models/postModel');
const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const Imgbb = require('imgbbjs');
const imgbb = new Imgbb({
  key: process.env.IMGBB_API_TOKEN,
});

// create post
router.post('/:_id', async(req,res)=>{
    if(req.body.image) {
        const imgbbObj = await imgbb.upload(req.body.image);
        const imageURL = (imgbbObj.data.url).toString();
        try {
            const { userId, content } = req.body;
            const newPost = new PostModel({
                userId: userId,
                content: content,
                image: imageURL
            });
            await newPost.save();
            res.status(200).json("New post added");
            }
        catch (error) {
            res.status(500).json(error);
        }
    }
    else {
        try {
            const newPost = new PostModel(req.body);
            await newPost.save();
            res.status(200).json("New post added");
        }
        catch (error) {
            res.status(500).json(error);
        }
    }
});
// comment in post
// update comment
// delete comment


module.exports = router;
