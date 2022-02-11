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



router.get("/template1", (req, res, next) => {
    res.render("./watermark/template1", {
        title: "Template 1",
        user: req.user,
    }
    );
});



module.exports = router;