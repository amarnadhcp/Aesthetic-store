const mongoose = require("mongoose")

require('dotenv').config();

mongoose.connect(process.env.mongoconnect)

const express = require("express")
const app = express();

const $ = require('jquery');

const logger = require("morgan")

app.use(logger("dev"))


const nocache = require('nocache') 

const session =require('express-session')
app.use(session({
    secret:"this is my secret",
    saveUninitialized:true,
    cookie:{maxAge:50000000},
    resave:false
  }));

  app.use(nocache());



 //path
 const path=require('path')
 app.use(express.static(path.join(__dirname,'public')))

// admin Routes
const adminRoute=require('./routes/adminRoute')
app.use('/admin',adminRoute)


const userRoute = require('./routes/userRoute');
const morgan = require("morgan");
app.use('/',userRoute)


app.listen(3000,()=>{
    console.log("server starts")
})