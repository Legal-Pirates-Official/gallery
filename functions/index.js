const { json } = require("body-parser");
const db = require("../database");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

exports.addGallery = (req, res) => {
  db.query(`SELECT * FROM users where id = ${3}`, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log(results, "results");
      if (results[0].gallery.length > 0) {
        console.log(req.files);
        const index = [];
        const name = [];
        const cloudinaryName = [];
        for (const key in req.files) {
          console.log(req.files[key]);
          cloudinaryName.push(
            req.files[key][0].path.split("/gallery/")[1].slice(0, -4)
          );

          name.push(key);
          index.push(key.slice(-1));
        }

        console.log(index);
        const updateimg = [];
        name.forEach((element) => {
          updateimg.push(req.files[element][0].path);
        });

        console.log(updateimg, "new");
        const oldimages = JSON.parse(results[0].gallery);
        index.forEach((element, i) => {
          oldimages[element] = updateimg[i];
        });
        console.log(oldimages, "updated");
        const newimages = JSON.stringify(oldimages);

        db.query(
          `UPDATE users SET ? where id = ${3}`,
          { gallery: newimages },
          (err, results) => {
            if (err) {
              console.log(err);
            } else {
              console.log(results, "updated");
              cloudinaryName.forEach(async (e) => {
                console.log(e);
                // await  cloudinary.uploader.destroy(`GALLERY/${e}`, function(result) { console.log(result,'result of cloud') });
              });
            }
          }
        );
      } else {
        const images = [];

        for (i = 0; i < 4; i++) {
          console.log(req.files, "req.files");
          console.log(req.files[`picture${i}`][0].path);
          images.push(req.files[`picture${i}`][0].path);
        }

        console.log(images);
        const json = JSON.stringify(images);
        db.query(
          `UPDATE users SET ? where id = ${3}`,
          { gallery: json },
          (err, results) => {
            if (err) {
              console.log(err);
            } else {
              console.log(results, "added");
            }
          }
        );
      }
    }
  });
};

exports.getGallery = (req, res) => {};
