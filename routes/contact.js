if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('../database');
const { isLoggedIn } = require('../middleware');
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const nodemailer = require("nodemailer");

router.get('/contact', (req, res) => {
	res.render('./contact', {
		user: req.user
	});
});

router.post('/contact', (req, res) => {
	try {
		const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>  
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_ID,
				pass: process.env.EMAIL_PASSWORD
			}
		});

		let mailOptions = {
			from: process.env.EMAIL_ID,
			to: process.env.EMAIL_ID,
			subject: 'Gallery Contact Form',
			html: output
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log("dfgdsf");
			return res.redirect('./contact');
		});
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

module.exports = router;
