//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
    const email = req.body.username;
    const passWord = req.body.password;
    const user = new User({
      email:email,
      password:passWord
    });
    user.save();
    res.render("secrets");
});

app.post("/login",function(req,res){
  const email = req.body.username;
  const passWord = req.body.password;
  User.findOne({email:email},function(err,foundUser){
    if(err){console.log(err);}
    else{
      if(!foundUser){console.log("The user you have entered is not registed");}
      else{
        if(passWord===foundUser.password){res.render("secrets");}
        else{console.log("wrong password");}
      }
    }
  });
});








app.listen(3000,function(){
  console.log("server started");
});
