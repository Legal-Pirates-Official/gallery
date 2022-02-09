<<<<<<< HEAD
if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require('../database');
const mysqlconnection = require("../database");
=======
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const path = require('path/posix');
const mysqlconnection = require('../database');
const { isLoggedIn } = require('../middleware');
>>>>>>> 7beb93d9668f120228ee51a0d08816721506925a
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");


<<<<<<< HEAD
=======
router.get("/", isLoggedIn, (req, res) => {
    res.render("index", { user: req.user });
})
router.get("/mypage", isLoggedIn, (req, res) => {
    if (req.user) {
        res.render("mypage", { user: req.user });
    } else {
        res.redirect("/auth/login");
    }
})
>>>>>>> 7beb93d9668f120228ee51a0d08816721506925a

const {addGallery} = require('../functions/index');






cloudinary.config({
  cloud_name: "dqx0eyiow",
  api_key: "469344161745916",
  api_secret: "Osuo6GsBn2QUkVPuZi8njErKZ5k",
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "GALLERY",
  },
});
const upload = multer({ storage });


router.get("/admintemplate", (req, res) => {
  db.query(`SELECT * FROM gallery where user_id = ${0}`, (err, results) => {
    if(err){

        console.log(err);
    } else{
        console.log(results.length,'results');
          
          const images = JSON.parse(results[0].images);
          console.log(images);
        
        res.render("admin/dummy", {arr: results.length > 0 ?  images :  null});
        
      }
});
});
router.get("/home", (req, res) => {
  db.query(`SELECT * FROM gallery where user_id = ${0}`, (err, results) => {
        if(err){
            console.log(err);
        }
        else{
            
            const images = JSON.parse(results[0].images);
            console.log(images);
            res.render("dummy",{arr:images});
          }
        
  });
});

router.post("/submit",upload.fields([
  {
  name: "picture1"},
  {
  name: "picture2"
  },{
  name: "picture3"
  },{
  name: "picture4"
}]),addGallery);
module.exports = router;
