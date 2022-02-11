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



router.get("/:valentine", (req, res) => {
    db.query(`SELECT * FROM users where id = ${req.cookies.user}`, (err,result) => {
        if (err) {
            console.log(err);
            res.redirect('/auth/login');
        } else {

            if(result[0] && result[0].valentine){
                res.send('not allowed');
            } else {
                db.query(`SELECT  from questions`)
                res.render('maintemplate');

            }
        }
    });
});

router.post("/", upload.fields([
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
    console.log(req.files,'req.files');

      const images = [];
      for (i = 0; i < 10; i++) {
        images.push(req.files[`image${i}`][0].path);
      }
       
        
        const json = JSON.stringify(images);
    

    db.query(`UPDATE users SET ? where id = ${req.cookies.user}`,{valentine: json},  (err, response) => {
        if (err) {
            console.log(err);
            res.redirect('/auth/login');
        } else {
            console.log(response);
        }
    })
});

router.post("/update", upload.fields([
    { name: "image1" },
    { name: "image2" },
    { name: "image3" },
    { name: "image4" },
    async (req, res) => {
        const oldImageName = req.body.oldImageURL
            .split('gallery/')[1]
            .slice(0, -4);
        await cloudinary.uploader.destroy(`gallery/${oldImageName}`);
        await mysqlConnection.query(
            'UPDATE maintemplate SET answer1=?, answer2=?, answer3=?, answer4=?, image1=?, image2=?, image3=?, image4=? WHERE id = ?',
            [
                req.body.answer1, req.body.answer2, req.body.answer3, req.body.answer4,
                req.files["image1"][0].path, req.files["image2"][0].path, req.files["image3"][0].path, req.files["image4"][0].path, req.body.id
            ], (err, response) => {
                if (err) {
                    req.flash('error', 'Error occurred while Updating');
                    console.log(err);
                    res.redirect('/maintemplate');
                    return;
                }
            }
        );
        req.flash('success', 'Images successfully updated');
        res.redirect('/maintemplate');
    }
]));


module.exports = router;