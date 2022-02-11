if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const mysql = require('mysql');
const express = require('express');
const path = require('path');
const router = express.Router({ mergeParams: true });
const methodOverride = require('method-override');
const multer = require('multer');
const { storage, cloudinary } = require('../cloudinary');
const upload = multer({ storage });
const db = require('../database');
const { isloggedin } = require('../middleware');
const jwt = require('jsonwebtoken');


router.get("/", (req, res) => {
    jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => {
        res.render("templates", { user_name: decoded ? decoded.user_name : null });
    });
});

router.get("/template1", (req, res, next) => {
    jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => {
        res.render("./templates/template1", { user_name: decoded ? decoded.user_name : null }
        );
    });
});



module.exports = router;