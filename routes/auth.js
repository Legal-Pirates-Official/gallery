if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database');
const isLoggedIn = require('../middleware');
const router = express.Router();
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');


// register
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
            password: hashedPassword,
            gallery: null
        };
        db.query("INSERT INTO users SET ?", newUser, (err, results) => {
            if (err) {
                console.log(err);
            }
            else {
                res.cookie("user" , results.insertId);
                console.log(results.insertId);
                req.flash("success_msg", "You are now registered and can log in");
                res.redirect("/auth/register");
            }
        });
    });
});



// login

router.get("/login", (req, res) => {
    res.render("auth/login");
    // res.json({"data": "data"});
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
                res.cookie("user" , results.insertId);
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
    // res.cookie("user" , results.insertId);
    res.status(200).redirect("/");
});




// forgot password


router.get("/forgotpassword", (req, res) => {
    res.render("auth/forgotpassword");
});

router.post("/forgotpassword", async (req, res) => {
    const { email } = req.body;
    db.query("SELECT * FROM users WHERE email=?", [email], async (err, results) => {
        if (err) {
            console.log(err);
        }
        else if (results.length > 0) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
            res.cookie('accessToken', token, {
                maxAge: 1000 * 60 * 3,
                httpOnly: true,
                signed: false
            });

            const url = `http://localhost:8080/auth/resetpassword/${token}`;

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_ID,
                to: email,
                subject: "Reset Password",
                html: `<h1>Reset Password</h1>` + `<p>Click this <a href="${url}">link</a> to reset your password</p>`
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(info);
                }
            });

            res.render("auth/forgotpassword", {
                success_msg: "Check your email for a link to reset your password"
            });
        }
    });
});


// reset password

router.get("/resetpassword/:token", async (req, res) => {
    console.log("12345")
    try {
        const { token } = req.params;
        // const { email } = jwt.verify(token, process.env.JWT_SECRET);
        if (token === req.cookies.accessToken) {
            res.render("auth/resetpassword", { token });
        } else {
            res.redirect("/auth/forgotpassword");
        }

    } catch (err) {
        console.log(err);
        res.redirect("/auth/forgotpassword");
    }
});


router.post("/resetpassword/:token", async (req, res) => {
    console.log("post")
    try {
        const { token } = req.params;
        const { email, password, confirm_password } = req.body;
        // const { email } = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(email);

        if (!password || !confirm_password) {
            return res.status(400).render("auth/resetpassword", {
                error_msg: "Please enter all fields"
            });
        }

        if (password != confirm_password) {
            return res.status(400).render("auth/resetpassword", {
                error_msg: "Passwords do not match"
            });
        }


        let hashedPassword = await bcrypt.hash(password, 10);
        db.query("UPDATE users SET password=? WHERE email=?", [hashedPassword, email], (err, results) => {
            if (err) {
                console.log(err);
            }
            else {
                res.render("auth/resetpassword", {
                    success_msg: "Password reset successfully"
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.redirect("/auth/forgotpassword");
    }
});



module.exports = router;