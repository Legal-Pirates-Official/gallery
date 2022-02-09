if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const db = require('./database');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            db.query("SELECT * FROM users WHERE id=?", [decoded.id], (err, results) => {
                if (!results) {
                    return next();
                }
                req.user = results[0];
                return next();
            })
        } catch (err) {
            console.log(err)
            return next();
        }
    } else {
        next();
    }
}
