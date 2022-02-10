if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database');
const isLoggedIn = require('../middleware');
const router = express.Router();
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');

// router.get("/verify", (req, res) => {
//     res.render("auth/verify");
// });

// verify new mail
// router.post('/verify', (req, res) => {
//     const { email } = req.body;
//     db.query(`SELECT * FROM users WHERE email = '${email}'`, (err, results) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('Internal Server Error');
//         } else {
//             if (results.length > 0) {
//                 res.status(404).send('Email not found');
//             } else {
//                 const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
//                 const transporter = nodemailer.createTransport({
//                     service: 'gmail',
//                     auth: {
//                         user: process.env.EMAIL_ID,
//                         pass: process.env.EMAIL_PASSWORD
//                     }
//                 });
//                 const mailOptions = {
//                     from: '"Coding Blocks"',
//                     to: email,

//                     subject: 'Verify Email',
//                     html: `<h1>Verify Email</h1>
//                     <p>Click on the link below to verify your email</p>
//                     // <a href="http://localhost:3000/auth/verify${token}">Verify Email</a>`
//                 };
//                 transporter.sendMail(mailOptions, (err, info) => {
//                     if (err) {
//                         console.log(err);
//                         res.status(500).send('Internal Server Error');
//                     } else {
//                         console.log(info);
//                         res.status(200).send('Email sent');
//                     }
//                 });
//             }
//         }
//     });
// });

// verify new mail link with token
// router.get('/verify/:token', (req, res) => {
//     const { token } = req.params;
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('Internal Server Error');
//         } else {
//             const { email } = decoded;
//             db.query(`UPDATE users SET verified = 1 WHERE email = '${email}'`, (err, results) => {
//                 if (err) {
//                     console.log(err);
//                     res.status(500).send('Internal Server Error');
//                 } else {
//                     res.redirect('/auth/login');
//                 }
//             });
//         }
//     });
// });

// register
router.get('/register', (req, res) => {
	res.render('auth/register');
});

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'legalpiratesofficial@gmail.com',
		pass: 'TeamOfSix6'
	}
});

router.post('/register', async (req, res) => {
	const { name, email, password, confirm_password } = req.body;
	const namenew = name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);
	db.query('SELECT * FROM users', (err, results) => {
		if (err) {
			console.log(err);
		} else {
			if (results) {
				results.forEach((result) => {
					if (result.name === namenew || result.email === email) {
						req.flash('error_msg', 'Username already exists');
						return res.redirect('/auth/login');
					}
				});
			} else {
				return res.redirect('/auth/register');
			}
		}
	});

	if (password !== confirm_password) {
		req.flash('error_msg', 'Passwords do not match');
		return res.redirect('/auth/register');
	} else {
		const accessToken = jwt.sign(
			{ name, email, password },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);
		var mailOptions = {
			from: 'legalpiratesofficial@gmail.com',
			to: req.body.email,
			subject: 'Register your account here',
			html: `<a href="http://localhost:8080/auth/register/verify/${accessToken}" >Click here to verify your account</a>`
		};
		console.log(accessToken);
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				res.json('Some error occurred');
			} else {
				req.flash('success_msg', 'Check your email to register your account');
				res.redirect('/auth/register');
			}
		});
	}
});

router.get('/register/verify/:token', async (req, res) => {
	console.log(req.params.token);
	jwt.verify(req.params.token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			console.log(err);
			req.flash('error_msg', 'Some error occured');
			return res.redirect('/auth/register');
		} else {
			db.query(
				`INSERT INTO users SET ?`,
				{
					name: decoded.name,
					email: decoded.email,
					password: decoded.password
				},
				(err, results) => {
					if (err) {
						console.log(err);
						req.flash('error_msg', 'Some error occured');
						return res.redirect('/auth/register');
					} else {
						const token = jwt.sign({ id: results.id }, process.env.JWT_SECRET, {
							expiresIn: process.env.JWT_EXPIRES_IN
						});
						const cookieOptions = {
							expires: new Date(
								Date.now() +
									process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
							),
							httpOnly: true
						};
						res.cookie('user', results.id);
						res.cookie('user_name', results.name);
						res.cookie('jwt', token, cookieOptions);
						req.flash('success_msg', 'Account verified successfully');
						return res.redirect('/auth/login');
					}
				}
			);
		}
	});
});
// login

router.get('/login', (req, res) => {
	res.render('auth/login', { error_msg: req.flash('error_msg') });
	// res.json({"data": "data"});
});

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res
				.status(400)
				.render('auth/login', { error: 'Please enter all fields' });
		}
		db.query(
			'SELECT * FROM users WHERE email=?',
			[email],
			async (err, results) => {
				if (
					!results ||
					(await !bcrypt.compare(password, results[0].password))
				) {
					return res.status(400).render('auth/login', {
						error_msg: 'Invalid credentials'
					});
				} else {
					const id = results[0].id;
					const token = jwt.sign({ id }, process.env.JWT_SECRET, {
						expiresIn: process.env.JWT_EXPIRES_IN
					});
					const cookieOptions = {
						expires: new Date(
							Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
						),
						httpOnly: true
					};
					res.cookie('user', results[0].id);
					res.cookie('user_name', results[0].name);
					res.cookie('jwt', token, cookieOptions);
					res.status(200).redirect('/');
				}
			}
		);
	} catch (err) {
		console.log(err);
	}
});

router.get('/logout', (req, res) => {
	res.cookie('jwt', 'logout', {
		expires: new Date(Date.now() + 2 * 1000),
		httpOnly: true
	});
	res.clearCookie('user');
	res.status(200).redirect('/');
});

// forgot password

router.get('/forgotpassword', (req, res) => {
	res.render('auth/forgotpassword');
});

router.post('/forgotpassword', async (req, res) => {
	const { email } = req.body;
	db.query(
		'SELECT * FROM users WHERE email=?',
		[email],
		async (err, results) => {
			if (err) {
				console.log(err);
			} else if (results.length > 0) {
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
					subject: 'Reset Password',
					html:
						`<h1>Reset Password</h1>` +
						`<p>Click this <a href="${url}">link</a> to reset your password</p>`
				};

				transporter.sendMail(mailOptions, (err, info) => {
					if (err) {
						console.log(err);
					} else {
					}
				});

				res.render('auth/forgotpassword', {
					success_msg: 'Check your email for a link to reset your password'
				});
			}
		}
	);
});

// reset password

router.get('/resetpassword/:token', async (req, res) => {
	try {
		const { token } = req.params;
		// const { email } = jwt.verify(token, process.env.JWT_SECRET);
		if (token === req.cookies.accessToken) {
			res.render('auth/resetpassword', { token });
		} else {
			res.redirect('/auth/forgotpassword');
		}
	} catch (err) {
		console.log(err);
		res.redirect('/auth/forgotpassword');
	}
});

router.post('/resetpassword/:token', async (req, res) => {
	console.log('post');
	try {
		const { token } = req.params;
		const { email, password, confirm_password } = req.body;
		// const { email } = jwt.verify(token, process.env.JWT_SECRET);

		if (!password || !confirm_password) {
			return res.status(400).render('auth/resetpassword', {
				error_msg: 'Please enter all fields'
			});
		}

		if (password != confirm_password) {
			return res.status(400).render('auth/resetpassword', {
				error_msg: 'Passwords do not match'
			});
		}

		let hashedPassword = await bcrypt.hash(password, 10);
		db.query(
			'UPDATE users SET password=? WHERE email=?',
			[hashedPassword, email],
			(err, results) => {
				if (err) {
					console.log(err);
				} else {
					res.render('auth/resetpassword', {
						success_msg: 'Password reset successfully'
					});
				}
			}
		);
	} catch (err) {
		console.log(err);
		res.redirect('/auth/forgotpassword');
	}
});

module.exports = router;
