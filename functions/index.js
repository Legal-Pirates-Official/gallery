const { json } = require("body-parser");
const db = require("../database");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

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
          name.push(key);
          index.push(key.slice(-1));
        }

        const updateimg = [];
        name.forEach((element) => {
          updateimg.push(req.files[element][0].path);
        });

        const oldimages = JSON.parse(results[0].gallery);
		
			index.forEach(async(element, i) => {
				
				const cloud = oldimages[element].split("/gallery/")[1].slice(0, -4)
				setTimeout(async() => {
					await cloudinary.uploader.destroy(
						`gallery/${cloud}`,
						async (error, result) => {console.log(error, result)
						}
					);
				}, 1000);
				
<<<<<<< HEAD
				oldimages[element] = updateimg[i];
				console.log(oldimages,'after');
				console.log(updateimg,'after');
			  //   setTimeout(() => {
			  //     cloudinaryName.push(
			  //       // req.files[key][0].path.split('/gallery/')[1].slice(0, -4)
			  //       oldimages[element].split("/gallery/")[1].slice(0, -4)
					
			  //     );
				  
			  //   }, 500);
=======
				  oldimages[element] = updateimg[i];
>>>>>>> 3fc7d7e3d1ee0f636ec95059b9fd60db43703b6a
		  
			  });
		
        
        const newimages = JSON.stringify(oldimages);
        // cloudinaryName.push(updateimg.split('/gallery/')[1].slice(0, -4));

        db.query(
          `UPDATE users SET ? WHERE id = ${id}`,
          { gallery: newimages },
          (err, results) => {
            if (err) {
              console.log(err);
              res.redirect("/admintemplate");
            } else {
              res.redirect("/" + req.cookies.user_name);
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
              res.redirect("/admintemplate");
            } else {
              res.redirect("/" + req.cookies.user_name);
            }
          }
        );
      }
    }
  });
};

exports.getGallery = (req, res) => {};
