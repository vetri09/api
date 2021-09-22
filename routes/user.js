const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const Imgbb = require('imgbbjs');
// const imgbb = new Imgbb({
//   key: process.env.IMGBB_API_TOKEN,
// });
// get
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
// search user
router.get('/search/:searchName', async(req,res)=>{
    try {
        const allUsers = await UserModel.find({confirmed:true})
        const users = await Promise.all(
            allUsers.filter((user)=>{
                if(user.userName.includes((req.params.searchName).toLowerCase())) return user
            })
        );
        res.send({users})
    } catch (error) {
         res.status(500).json(error);
    }
});
// get all following users
router.get('/following', async(req, res) => {
    const user = await UserModel.findById(req.body._id);
    res.send(user.following);
});
// get all non following users
router.get('/notfollowing/:_id', async(req, res) => {
    const user = await UserModel.findById(req.params._id);
    const allUsers = await UserModel.find({confirmed:true});
    const notFollowing = await Promise.all(
        allUsers.filter(users=>{
            if(!users.followers.includes(user._id) && ((users._id).toString() !== req.params._id)){
                return users
            }
        })
    );
    res.send(notFollowing);
});
// get a user using name
router.get('/profile', async(req, res) => {
    const userName = req.query.userName;
    try {
        const user = await UserModel.findOne({userName:userName})
        const { password, updatedAt, confirmed, ...other } = user._doc
        res.status(200).send({
            other,
            message:"User find"
        })
    } catch (error) {
        res.status(500).json(error);
    }
});
// get a user
router.get('/:_id', async(req, res) => {
    try {
        const user = await UserModel.findById(req.params._id)
        const { password, updatedAt, confirmed, ...other } = user._doc
        res.status(200).send({
            other,
            message:"User find"
        })
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
