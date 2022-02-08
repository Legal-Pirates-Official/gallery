if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database');
const isLoggedIn = require('../middleware');
const router = express.Router();

router.get("/register", (req, res) => {
    res.render("auth/register");
});

router.post("/register", async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
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
            return res.status(400).render("auth/login", { error: "Please enter all fields" });
        }

        db.query("SELECT * FROM users WHERE email=?", [email], async (err, results) => {
            if (!results || await !(bcrypt.compare(password, results[0].password))) {
                return res.status(400).render("auth/login", {
                    error_msg: "Invalid credentials"
                });
            }
            else {
                const id = results[0].id;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie("jwt", token, cookieOptions);
                res.status(200).redirect("/mypage")
            }
        });
    } catch (err) {
        console.log(err);
    }
})


router.get("/logout", (req, res) => {
    res.cookie("jwt", "logout", {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });
    res.status(200).redirect("/");
})



module.exports = router;