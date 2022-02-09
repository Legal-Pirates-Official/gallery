const { json } = require('body-parser');
const db = require('../database');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

exports.addGallery = (req, res) => {
	const id = req.cookies.user;
	db.query(`SELECT * FROM users WHERE id = ${id}`, (err, results) => {
		if (err) {
			console.log(err);
		} else {
			if (results[0].gallery && results[0].gallery.length > 0) {
				const index = [];
				const name = [];
				const cloudinaryName = [];
				for (const key in req.files) {
					cloudinaryName.push(
						req.files[key][0].path.split('/gallery/')[1].slice(0, -4)
					);

					name.push(key);
					index.push(key.slice(-1));
				}

				const updateimg = [];
				name.forEach((element) => {
					updateimg.push(req.files[element][0].path);
				});

				const oldimages = JSON.parse(results[0].gallery);
				index.forEach((element, i) => {
					oldimages[element] = updateimg[i];
				});
				const newimages = JSON.stringify(oldimages);

				db.query(
					`UPDATE users SET ? WHERE id = ${id}`,
					{ gallery: newimages },
					(err, results) => {
						if (err) {
							console.log(err);
							res.redirect('/admintemplate');
						} else {
						
							console.log(res.cookie.user_name);
							res.redirect('/' + res.cookies.user_name);
						}
					}
				);
			} else {
				const images = [];

				for (i = 0; i < 4; i++) {
					images.push(req.files[`picture${i}`][0].path);
				}

				const json = JSON.stringify(images);
				db.query(
					`UPDATE users SET ? WHERE id = ${id}`,
					{ gallery: json },
					(err, results) => {
						if (err) {
							console.log(err);
							res.redirect('/admintemplate');
						} else {
							res.redirect('/' + res.cookie.user_name);
						}
					}
				);
			}
		}
	});
};

exports.getGallery = (req, res) => {};
