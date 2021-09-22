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
// get feed posts
router.get('/feed/:userId', async(req,res)=>{
    try {
        const currentUser = await UserModel.findById(req.params.userId);
        const userPosts = await PostModel.find({userId:currentUser._id});
        const followingPost = await Promise.all(
            currentUser.following.map((friendId)=>{
                return PostModel.find({userId:friendId});
            })
        );
        res.status(200).json(userPosts.concat(...followingPost));
    } catch (error) {
        res.status(500).json(error);
    }
})
// get user post using name
router.get('/userpost/:userName', async(req,res)=>{
    try {
        const user = await UserModel.findOne({userName:req.params.userName});
        const userPosts = await PostModel.find({userId:user._id});
        res.status(200).json(userPosts);
    } catch (error) {
        res.status(500).json(error);
    }
})
// get user post
router.get('/user/userpost/:userId',async(req,res)=>{
    try {
        const currentUser = await UserModel.findById(req.params.userId);
        const userPosts = await PostModel.find({userId:currentUser._id});
        res.json(userPosts);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;
