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
router.get('/register', (req, res) => {
	res.render('auth/register');
});

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_ID,
		pass: process.env.EMAIL_PASSWORD
	}
});

router.post('/register', async (req, res) => {
	const { name, email, password, confirm_password } = req.body;
	const namenew = name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);
	db.query('SELECT * FROM users', async (err, results) => {
		if (err) {
			console.log(err);
		} else {
			if (results) {
				results.forEach((result) => {
					if (result.name === namenew && result.email === email) {
						req.flash('error_msg', 'User already exists');
						return res.redirect('/auth/login');
					} else if (result.email === email) {
						req.flash('error_msg', 'Email already exists');
						return res.redirect('/auth/register');
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
			{ user_name: name, email, password: await bcrypt.hash(password, 10) },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		var mailOptions = {
			from: process.env.EMAIL_ID,
			to: req.body.email,
			subject: 'Register your account here',
			html: `<a href="${process.env.DOMAIN}/auth/register/verify/${accessToken}" >Click here to verify your account</a>`
		};

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
	jwt.verify(req.params.token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			console.log(err);
			req.flash('error_msg', 'Some error occured');
			return res.redirect('/auth/register');
		} else {
			db.query(
				`INSERT INTO users SET ?`,
				{
					name: decoded.user_name,
					email: decoded.email,
					password: decoded.password
				},
				(err, results) => {
					if (err) {
						console.log(err);
						req.flash('error_msg', 'Some error occured');
						return res.redirect('/auth/register');
					} else {
						const token = jwt.sign(
							{
								user_name: decoded.user_name,
								email: decoded.email,
								id: results.insertId
							},
							process.env.JWT_SECRET,
							{
								expiresIn: process.env.JWT_EXPIRES_IN
							}
						);
						const cookieOptions = {
							expires: new Date(
								Date.now() +
									process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
							),
							httpOnly: true
						};
						res.cookie('jwt', token, cookieOptions);
						req.flash('success_msg', 'Account verified successfully');
						return res.redirect(`/user/${decoded.user_name}`);
					}
				}
			);
		}
	});
});

// login
router.get('/login', (req, res) => {
	res.render('auth/login', { error_msg: req.flash('error_msg') });
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
				if (err || results.length === 0) {
					return res.status(400).render('auth/login', {
						error_msg: 'Invalid credentials'
					});
				} else {
					if (await bcrypt.compare(password, results[0].password)) {
						const token = jwt.sign(
							{
								user_name: results[0].name,
								email: results[0].email,
								id: results[0].id
							},
							process.env.JWT_SECRET,
							{
								expiresIn: process.env.JWT_EXPIRES_IN
							}
						);
						const cookieOptions = {
							expires: new Date(
								Date.now() +
									process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
							),
							httpOnly: true
						};

						res.cookie('jwt', token, cookieOptions);
						res.status(200).redirect('/');
					} else {
						return res.status(400).render('auth/login', {
							error_msg: 'Invalid credentials'
						});
					}
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
	res.clearCookie('jwt');
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

				const url = `${process.env.DOMAIN}/auth/resetpassword/${token}`;

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
						console.log(info);
						res.render('auth/forgotpassword', {
							success_msg: 'Check your email for reset password link'
						});
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
