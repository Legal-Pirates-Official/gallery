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
const { isloggedin, isLoggedIn } = require('../middleware');
const jwt = require('jsonwebtoken');

router.get('/maintemplate', (req, res) => {
	const jwtconst = jwt.verify(
		req.cookies.jwt,
		process.env.JWT_SECRET,
		(err, decoded) => {
			db.query(
				`SELECT * FROM users where id = ${decoded.id}`,
				(err, result) => {
					if (err) {
						console.log(err);
						res.redirect('/auth/login');
					} else {
						if (result[0] && result[0].valentine) {
							res.send('not allowed');
						} else {
							console.log(result[0].mode, 'moders');
							const ques = [];
							db.query(
								`SELECT ${result[0].mode} from questions`,
								(err, result2) => {
									result2.forEach((element) => {
										ques.push(element[result[0].mode]);
									});
									console.log(ques, 's');
									res.render('./valentine/maintemplate', { text: ques });
								}
							);
						}
					}
				}
			);
		}
	);
});

router.post(
	'/maintemplate',
	upload.fields([
		{ name: 'image0' },
		{ name: 'image1' },
		{ name: 'image2' },
		{ name: 'image3' },
		{ name: 'image4' },
		{ name: 'image5' },
		{ name: 'image6' },
		{ name: 'image7' },
		{ name: 'image8' },
		{ name: 'image9' }
	]),
	(req, res) => {
		console.log(req.files);
		const images = [];
		for (const key in req.files) {
			images.push(req.files[key][0].path);
		}
		const json = JSON.stringify(images);
		const jwtconst = jwt.verify(
			req.cookies.jwt,
			process.env.JWT_SECRET,
			(err, decoded) => {
				db.query(
					`UPDATE users SET ? where id = ${decoded.id}`,
					{ valentine: json },
					(err, result) => {
						if (err) {
							console.log(err);
							res.redirect('/auth/login');
						} else {
							res.redirect('/en/valentine/templates');
						}
					}
				);
			}
		);
	}
);

router.post(
	'/maintemplate/update',
	upload.fields([
		{ name: 'image1' },
		{ name: 'image2' },
		{ name: 'image3' },
		{ name: 'image4' },
		async (req, res) => {
			const oldImageName = req.body.oldImageURL
				.split('gallery/')[1]
				.slice(0, -4);
			await cloudinary.uploader.destroy(`gallery/${oldImageName}`);
			await db.query(
				'UPDATE maintemplate SET answer1=?, answer2=?, answer3=?, answer4=?, image1=?, image2=?, image3=?, image4=? WHERE id = ?',
				[
					req.body.answer1,
					req.body.answer2,
					req.body.answer3,
					req.body.answer4,
					req.files['image1'][0].path,
					req.files['image2'][0].path,
					req.files['image3'][0].path,
					req.files['image4'][0].path,
					req.body.id
				],
				(err, response) => {
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
	])
);

router.get('/category', (req, res) => {
	const jwtconst = jwt.verify(
		req.cookies.jwt,
		process.env.JWT_SECRET,
		(err, decoded) => {
			if (!decoded) {
				console.log(err, 'err');
				res.redirect('/auth/login');
			} else {
				db.query(
					`SELECT * FROM users where id = ${decoded.id}`,
					(err, result) => {
						if (err) {
							console.log(err, 'decode err');
							res.redirect('/auth/login');
						} else {
							res.render('./valentine/category');
						}
					}
				);
			}
		}
	);
});
router.get('/category/:mode', (req, res) => {
	const jwtconst = jwt.verify(
		req.cookies.jwt,
		process.env.JWT_SECRET,
		(err, decoded) => {
			db.query(
				`UPDATE users  SET ? where id = ${decoded.id}`,
				{ mode: req.params.mode },

				(err, result) => {
					if (err) {
						console.log(err);
						res.redirect('/auth/login');
					} else {
						return res.redirect('/en/valentine/maintemplate');
					}
				}
			);
		}
	);
});

router.get('/templates', isLoggedIn, (req, res) => {
	const jwtconst = jwt.verify(
		req.cookies.jwt,
		process.env.JWT_SECRET,
		(err, decoded) => {
			db.query(
				`SELECT * FROM users where id = ${decoded.id}`,
				(err, result) => {
					if (err) {
						console.log(err);
						res.redirect('/auth/login');
					} else {
						res.render('./valentine/templates');
					}
				}
			);
		}
	);
});

router.get('/templates/template1', (req, res) => {
	const mode = req.params.mode;
	const jwtconst = jwt.verify(
		req.cookies.jwt,
		process.env.JWT_SECRET,
		(err, decoded) => {
			if (!decoded) {
				console.log(err, 'err');
				res.redirect('/auth/login');
			} else {
				db.query(
					`SELECT * FROM users where id = ${decoded.id}`,
					(err, result1) => {
						if (err) {
							console.log(err);
							res.redirect('/auth/login');
						} else {
							if (result1[0].currentTemplate) {
								console.log(result1[0].currentTemplate, 'template');
								return res.redirect(`/user/${result1[0].name}`);
							}
							const ques = [];
							db.query(
								`SELECT ${result1[0].mode} from questions`,
								(err, result) => {
									if (err) {
										console.log(err);
									} else {
										result.forEach((element) => {
											ques.push(element[mode]);
										});
										console.log(ques);
									}
								}
							);
							const json = JSON.parse(result1[0].valentine);
							res.render('./valentine/templates/template1', {
								text: ques,
								image: json,
								type: 'preview'
							});
						}
					}
				);
			}
		}
	);
});
router.get('/templates/template3', (req, res) => {
	res.render('./valentine/templates/template3');
});
router.get('/templates/template2', (req, res) => {
	const mode = req.params.mode;
	const jwtconst = jwt.verify(
		req.cookies.jwt,
		process.env.JWT_SECRET,
		(err, decoded) => {
			if (!decoded) {
				console.log(err, 'err');
				res.redirect('/auth/login');
			} else {
				db.query(
					`SELECT * FROM users where id = ${decoded.id}`,
					(err, result1) => {
						if (err) {
							console.log(err);
							res.redirect('/auth/login');
						} else {
							if (result1[0].currentTemplate) {
								console.log(result1[0].currentTemplate, 'template');
								return res.redirect(`/user/${result1[0].name}`);
							}
							const ques = [];
							db.query(
								`SELECT ${result1[0].mode} from questions`,
								(err, result) => {
									if (err) {
										console.log(err);
									} else {
										result.forEach((element) => {
											ques.push(element[mode]);
										});
										console.log(ques);
									}
								}
							);
							const json = JSON.parse(result1[0].valentine);
							res.render('./valentine/templates/template2', {
								text: ques,
								image: json,
								type: 'preview',
								title: req.params.username
							});
						}
					}
				);
			}
		}
	);
});

router.post('/templatemode/:currentTemplate', (req, res) => {
	const currentTemplate = req.params.currentTemplate;
	const jwtconst = jwt.verify(
		req.cookies.jwt,
		process.env.JWT_SECRET,
		(err, decoded) => {
			const date = new Date();
			date.setDate(date.getDate() + 7);
			db.query(
				`UPDATE users SET ? where id = ${decoded.id}`,
				{ currentTemplate: currentTemplate, date },
				(err, result) => {
					if (err) {
						console.log(err);
						res.redirect('/auth/login');
					} else {
						console.log('====================================');
						console.log(result);
						console.log('====================================');
						db.query(
							'SELECT * from users where id = ?',
							[decoded.id],
							(err, result) => {
								if (err) {
									console.log(err);
								} else {
									console.log(result);
									res.json(result);
									const name = result[0].name.toLowerCase();
									// res.redirect(`http://localhost:8080/${name}`);
								}
							}
						);
					}
				}
			);
		}
	);
});
router.get('/notallowed', (err, res) => {
	res.render('./valentine/notallowed');
});
module.exports = router;
