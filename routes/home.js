if(process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const path = require('path/posix');
const mysqlconnection = require('../database');
const router = express.Router();


router.get("/", (req, res) => {
    res.render("index");
})

module.exports = router;