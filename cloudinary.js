const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: process.env.CLOUDINARY_FOLDER_NAME,
		allowedFormats: ['jpeg', 'png', 'jpg']
	}
});

module.exports = {
	cloudinary,
	storage
};
