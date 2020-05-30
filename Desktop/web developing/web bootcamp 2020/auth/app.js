//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const encrypt = require('mongoose-encryption');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/auth", {useNewUrlParser: true, useUnifiedTopology: true});
const authScheme = new mongoose.Schema({email : "string",password:"string"});
var secret = process.env.SECRET;
authScheme.plugin(encrypt, { secret: secret , excludeFromEncryption: ["email"] });
const User = mongoose.model("user" ,authScheme);
app.get("/",function(req,res){
  res.render("home");
});
app.route("/register")
.get(function(req,res){
  res.render("register");
})
.post(function(req,res){
const user = new User ({email:req.body.username , password:req.body.password });
user.save(function(err){
  if(err){
    res.send(err);
  }else{
    res.render("secrets");
  }
});
});
app.route("/login")
.get(function(req,res){
  res.render("login");
})
.post(function(req,res){
  const us = req.body.username;
  const pass =req.body.password;
  User.findOne({email:us},function(err,doc){
    if(doc){
      if(pass=== doc.password){
        res.render("secrets");
      }else{
        return res.render("login");
      }

    }else{
      // req.flash("no such user");
        return res.render("login");
      // res.send("no such user");
      // res.redirect("/login");
    }
  });
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
