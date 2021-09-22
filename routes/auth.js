require('dotenv').config();
const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// user email verification send
router.post('/verify', async(req,res)=>{
    const {userName,email} = req.body;
    console.log(req.body);
    const emailToken = jwt.sign(
        {
            email: email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '1d',
        },
    );
    const url = `http://localhost:3001/auth/confirmtoken/${emailToken}`

    let smptTransport = nodemailer.createTransport({
        service:"Gmail",
        port:465,
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

  await smptTransport.sendMail(mailOptions,(err,res)=>{
    if(err){
      console.log(err)
    }else{
      res.send("sucess")
    }
  });

  smptTransport.close();
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

module.exports = router;
