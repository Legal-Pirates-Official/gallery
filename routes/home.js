const express = require('express');
const path = require('path/posix');
const router = express.Router();


router.get("/", (req, res) => {
    res.render("index");
})

module.exports = router;