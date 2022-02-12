const { storage, cloudinary } = require('../cloudinary');
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('../database');
const { isLoggedIn } = require('../middleware');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
	jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => {
		res.render('index', { email: decoded ? decoded.email : null });
	});
});

const { addGallery } = require('../functions/index');

const upload = multer({ storage });

router.get('/admintemplate', (req, res) => {
	if (req.cookies.user_name) {
		const id = req.cookies.user;
		db.query(`SELECT * FROM users WHERE id = ${id}`, (err, results) => {
			if (err) {
				console.log(err);
			} else {
				if (results[0].gallery && results[0].gallery.length > 0) {
					const images = JSON.parse(results[0].gallery);
					res.render('admin/dummy', { arr: images });
				} else {
					res.render('admin/dummy', { arr: null });
				}
			}
		});
	} else {
		res.redirect('/auth/login');
	}
});

router.get('/user/:username', (req, res) => {
	const jwtconst = jwt.verify(
		req.cookies.jwt,
		process.env.JWT_SECRET,
		(err, decoded) => {
			db.query(
				'SELECT * FROM users where name = ?',
				[req.params.username],
				(err, result3) => {
					if (err) {
						console.log(err);
					} else {
						console.log(
							'🚀 ~ file: home.js ~ line 54 ~ router.get ~ result3',
							result3[0]
						);
						if (!result3[0].date) {
							if (!(result3[0].date < new Date().getDate())) {
								db.query(
									'UPDATE users where name = ? SET ?',
									[req.params.username],
									{ currentTemplate: null, date: null, valentine: null },
									(err, resultupdate) => {
										if (err) {
											console.log(err);
										} else {
											req.flash('Template has been expired');
											return res.redirect('/en/valentine/templates');
										}
									}
								);
							}
						} else {
							req.flash('Choose your template');
							return res.redirect('/en/valentine/templates');
						}

						db.query(
							`SELECT ${result3[0].mode} from questions`,
							(err, result2) => {
								if (err) {
									console.log(err);
								} else {
									const ques = [];
									result2.forEach((element) => {
										ques.push(element[result3[0].mode]);
									});
									const page = result3[0].currentTemplate;
									if (!page) {
										return res.redirect('/en/valentine/templates');
									}
									const json = JSON.parse(result3[0].valentine);
									res.render(`./valentine/templates/${page}`, {
										text: ques,
										image: json,
										type: 'final',
										title: req.params.username
									});
								}
							}
						);
					}
				}
			);
		}
	);
});
router.post(
	'/submit',
	upload.fields([
		{
			name: 'picture0'
		},
		{
			name: 'picture1'
		},
		{
			name: 'picture2'
		},
		{
			name: 'picture3'
		}
	]),
	addGallery
);

// router.get('/:username', (req, res) => {
// 	const username = req.params.username;

// 	if (req.cookies.user_name.toLowerCase() == username.toLowerCase()) {
// 		const id = req.cookies.user;
// 		db.query(`SELECT * FROM users WHERE id = ${id}`, (err, results) => {
// 			if (err) {
// 				console.log(err);
// 				res.redirect('/auth/login');
// 			} else {
// 				if (results[0].gallery && results[0].gallery.length > 0) {
// 					const images = JSON.parse(results[0].gallery);
// 					res.render('dummy', { arr: images });
// 				} else {
// 					res.redirect('/admintemplate');
// 				}
// 			}
// 		});
// 	} else {
// 		res.redirect('/auth/login');
// 	}
// });

module.exports = router;
