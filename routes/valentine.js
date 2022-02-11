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

router.get("/maintemplate", (req, res) => {
    const jwtconst = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => {
        db.query(`SELECT * FROM users where id = ${decoded.id}`, (err, result) => {
            if (err) {
                console.log(err);
                res.redirect('/auth/login');
            } else {
                if (result[0] && result[0].valentine) {
                    res.send('not allowed');
                } else {
                    res.render('./valentine/maintemplate');
                }
            }
        });
    });
});

router.post("/maintemplate", upload.fields([
    { name: "image0" },
    { name: "image1" },
    { name: "image2" },
    { name: "image3" },
    { name: "image4" },
    { name: "image5" },
    { name: "image6" },
    { name: "image7" },
    { name: "image8" },
    { name: "image9" }
]), (req, res) => {
    for (const key in req.files) {
        images.push(req.files[key][0].path);
    }
    const json = JSON.stringify(images);
    const jwtconst = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => {
        db.query(`UPDATE users SET ? where id = ${decoded.id}`, { valentine: json }, (err, response) => {
            if (err) {
                console.log(err);
                res.redirect('/auth/login');
            } else {
                if (result[0] && result[0].valentine) {
                    res.send('not allowed');
                } else {
                    res.redirect('/en/valentine/templates');
                }
            }
        })
    });
});

router.post("/maintemplate/update", upload.fields([
    { name: "image1" },
    { name: "image2" },
    { name: "image3" },
    { name: "image4" },
    async (req, res) => {
        const oldImageName = req.body.oldImageURL
            .split('gallery/')[1]
            .slice(0, -4);
        await cloudinary.uploader.destroy(`gallery/${oldImageName}`);
        await db.query(
            'UPDATE maintemplate SET answer1=?, answer2=?, answer3=?, answer4=?, image1=?, image2=?, image3=?, image4=? WHERE id = ?',
            [
                req.body.answer1, req.body.answer2, req.body.answer3, req.body.answer4,
                req.files["image1"][0].path, req.files["image2"][0].path, req.files["image3"][0].path, req.files["image4"][0].path, req.body.id
            ], (err, response) => {
                if (err) {
                    req.flash('error', 'Error occurred while Updating');
                    console.log(err);
                    res.redirect('/en/valentine/maintemplate');
                    return;
                }
            }
        );
        req.flash('success', 'Images successfully updated');
        res.redirect('/en/valentine/maintemplate');
    }
]));

router.get("/category", (req, res) => {
    const jwtconst = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => {
        db.query(`SELECT * FROM users where id = ${decoded.id}`, (err, result) => {
            if (err) {
                console.log(err);
                res.redirect('/auth/login');
            } else {
                if (result[0] && result[0].valentine) {
                    res.send('not allowed');
                } else {
                    res.render('./valentine/category');
                }
            }
        });
    });
});

router.get("/templates", (req, res) => {
    const jwtconst = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => {
        db.query(`SELECT * FROM users where id = ${decoded.id}`, (err, result) => {
            if (err) {
                console.log(err);
                res.redirect('/auth/login');
            } else {
                if (result[0] && result[0].valentine) {
                    res.send('not allowed');
                } else {
                    res.render('./valentine/templates');
                }
            }
        });
    });
});

router.get("/templates/template1", (req, res) => {
    const jwtconst = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => {
        db.query(`SELECT * FROM users where id = ${decoded.id}`, (err, result) => {
            if (err) {
                console.log(err);
                res.redirect('/auth/login');
            } else {

                if (result[0] && result[0].valentine) {
                    res.send('not allowed');
                } else {
                    res.render('./valentine/templates/template1');
                }
            }
        });
    });
});

module.exports = router;