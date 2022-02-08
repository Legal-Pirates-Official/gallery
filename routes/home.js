if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const path = require('path/posix');
const mysqlconnection = require('../database');
const { isLoggedIn } = require('../middleware');
const router = express.Router();


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

module.exports = router;