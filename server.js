require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const postRouter = require('./routes/posts');
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/posts', postRouter);

const dburl = process.env.DB_URL;
mongoose.connect(dburl, {useNewUrlParser:true, useUnifiedTopology: true}).then(
  res=>{
      console.log('connected to db');
  }
).catch(err=>{
  console.log(err);
});

const PORT = process.env.PORT || '3001';
app.listen(PORT, () => {
  console.log("server is running at " + PORT);
});
