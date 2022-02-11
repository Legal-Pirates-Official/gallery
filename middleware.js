if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const db = require('./database');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports.isLoggedIn = async (req, res, next) => {
	if (req.cookies.jwt) {
		try {
			jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => {
				db.query(
					'SELECT * FROM users WHERE id=?',
					[decoded.user],
					(err, results) => {
						if (err) {
							console.log(err);
							return next();
						} else {
							req.user = results[0];
							return next();
						}
					}
				);
			});
		} catch (err) {
			console.log(err);
			return next();
		}
	}
};
