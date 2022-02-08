if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database');
const router = express.Router();

router.get("/register", (req, res) => {
    res.render("auth/register");
});

router.post("/register", async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    console.log(req.body);
    db.query("SELECT email FROM users WHERE email=?", [email], async (err, results) => {
        if (err) {
            console.log(err);
        }
        else if (results.length > 0) {
            req.flash("error_msg", "Email already exists");
            res.redirect("/auth/register");
        }
        else if (password != confirm_password) {
            req.flash("error_msg", "Passwords do not match");
            res.redirect("/auth/register");
        }


        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        const newUser = {
            name: name,
            email: email,
            password: hashedPassword
        }

        db.query("INSERT INTO users SET ?", newUser, (err, results) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(results);
                req.flash("success_msg", "You are now registered and can log in");
                res.redirect("/auth/register");
            }
        });
    });



    // res.send("Form Submitted");
});

router.get("/login", (req, res) => {
    res.render("auth/login");
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            req.flash("error", "Missing email or password!");
            res.redirect("/auth/login");
        }
        db.query(
            `SELECT * FROM users where email = ?`, [email],
            async (err, rows, results) => {
                if (!err) {
                    const isMatch = await bcrypt.compare(password, rows[0].password);
                    if (isMatch) {
                        const loginuser = 'Yes';
                        req.session.loginuser = loginuser;
                        res.redirect("/");
                    } else {
                        req.flash("error", "Incorrect password!");
                        res.redirect("/auth/login");
                        // res.status(400).json("Incorrect password");
                    }
                } else {
                    console.log(err);
                }
            }
        );
    } catch (e) {
        req.flash("error", "Incorrect email or password!");
        console.log(e);
        res.status(400).json("Something broke!");
    }
});



module.exports = router;