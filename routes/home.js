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
		res.render('index', { user_name: decoded ? decoded.user_name : null });
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

router.get('/:username', (req, res) => {
	const username = req.params.username;

	if (
		req.cookies.user_name &&
		req.cookies.user_name.toLowerCase() == username.toLowerCase()
	) {
		const id = req.cookies.user;
		db.query(`SELECT * FROM users WHERE id = ${id}`, (err, results) => {
			if (err) {
				console.log(err);
				res.redirect('/auth/login');
			} else {
				if (results[0].currentTemplate) {
					switch (results[0].currentTemplate) {
						case 'template1':
							return res.redirect('/en/valentine/templates/template1');
							break;
					}
					// if (results[0].gallery && results[0].gallery.length > 0) {
					// 	const images = JSON.parse(results[0].gallery);
					// 	res.render('dummy', { arr: images });
					// } else {
					// 	res.redirect('/admintemplate');
					// }
				} else {
					res.redirect('/en/valentine/category');
				}
			}
		});
	} else {
		res.redirect('/auth/login');
	}
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
