require('dotenv').config();
const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// const url = `http://localhost:3001/auth/confirmtoken/${emailToken}`
// user email verification send
router.post('/verify', async(req,res)=>{
    try {
        const {userName,email} = req.body;
        const emailToken = jwt.sign(
            {
                email: email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '1d',
            },
        );
        const url = `https://demooapi.herokuapp.com/auth/confirmtoken/${emailToken}`;
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            // port:465,
            auth:{
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASS
            }
        });
        let mailOptions = {
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject:`Confirm email`,
            html:`<p>Hey ${ userName }, Please click this link to verify your email: ${ url }</p>`
        };
        await transporter.sendMail(mailOptions,(err,res)=>{
            if(err){
                console.log(err);
            }else{
                res.send(res);
            }
        });
        transporter.close();
    }
    catch (error) {
        res.status(500).send(error);
    }
});
// user email verification receive
router.get('/confirmtoken/:token', async(req,res)=>{
    try{
        const data = jwt.verify(req.params.token, process.env.ACCESS_TOKEN_SECRET);
        console.log(data)
        console.log(data.email)
        await UserModel.findOneAndUpdate({email:data.email},{confirmed: true})
        res.send("Account confirmed. Kindly login");
    }
    catch(e){
        res.send(e);
    }
});
// user register
router.post('/register', async(req,res)=>{
    try {
        const list = await new UserModel(req.body);
        list.save((err,user)=>{
            if(user) {
                res.status(201).send({
                    list,
                    message:"User added"
                })
            }
            else {
                if(err.code && err.code == 11000) {
                    console.log(Object.keys(err.keyValue).toString())
                    const field = Object.keys(err.keyValue).toString();
                    const code = 409;
                    const error = `An account with that ${field} already exists.`;
                    res.status(code).send({messages: error, fields: field});
                }
                if(err.name === 'ValidationError') {
                    let errors = Object.values(err.errors).map(el => el.message);
                    let fields = Object.values(err.errors).map(el => el.path);
                    let code = 400;
                    if(errors.length > 1) {
                        const formattedErrors = errors.join(' ');
                        res.status(code).send({messages: formattedErrors, fields: fields});
                    } else {
                        res.status(code).send({messages: errors, fields: fields})
                    }
                }
            }
        })
    } catch (error) {
        res.status(500).send(error);
    }
});
// user login
router.post('/login', async(req,res)=>{
    const body = req.body;
    const user = await UserModel.findOne({email:body.email})
    if(!user){
        res.status(401).json({messages:"This email does not exist"})
    }
    if(!user.confirmed){
        res.status(401).json({messages:"Please confirm your email to login"})
    }
    const validPassword = await bcrypt.compare(body.password, user.password)
    if(!validPassword){
        res.status(403).json({messages:"Invalid password"})
    }
    const token = jwt.sign(
        {
            email: user.email,
            _id: user._id
        },
        process.env.JWT_SECRET,
        {expiresIn: "1hr"},
    )
    res.status(200).json({
        token
        : token,
        user,
        messages:"Login success"
    })
});
module.exports = router;