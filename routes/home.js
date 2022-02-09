const { storage, cloudinary } = require("../cloudinary");
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('../database');
const { isLoggedIn } = require('../middleware');
const router = express.Router();
const multer = require("multer");


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

const { addGallery } = require('../functions/index');

const upload = multer({ storage });


router.get("/admintemplate", (req, res) => {
  db.query(`SELECT * FROM users where id = ${3}`, (err, results) => {
    if (err) {

      console.log(err);
    } else {
      console.log(results.length, 'results');
      if (results[0].gallery.length > 0) {
        const images = JSON.parse(results[0].gallery);
        console.log(images)
        res.render("admin/dummy", { arr: images });
      } else {
        res.render("admin/dummy", { arr: null });
      }

    }
  });
});
router.get("/home", (req, res) => {
  console.log(res.locals.user);
  console.log(req.cookies.user);
  console.log(req.user);
  db.query(`SELECT * FROM users where id = ${3}`, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(results[0].gallery);
      if (results[0].gallery.length > 0) {
        const images = JSON.parse(results[0].gallery);
        console.log(images)
        res.render("dummy", { arr: images });
      } else {
        res.render("dummy", { arr: null });
      }
    }

  });
});

router.post("/submit", upload.fields([
  {
    name: "picture0"
  },
  {
    name: "picture1"
  }, {
    name: "picture2"
  }, {
    name: "picture3"
  }]), addGallery);
module.exports = router;
