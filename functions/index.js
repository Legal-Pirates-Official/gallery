const { json } = require('body-parser');
const db = require('../database');
exports.addGallery = (req, res) => {
    db.query(`SELECT * FROM gallery where user_id = ${0}`, (err, results) => {
        if(err) {
            console.log(err);
        } else {
            console.log(results.length,'results')
            if(results.length > 0) {
                    const name = Object.keys(req.files)[0]
                    console.log(name.slice(-1),'kk');
                    const updateimg = req.files[name][0].path;
                    const oldimages = JSON.parse(results[0].images);
                    // db.query(`UPDATE gallery where user_id = ${0} SET ?`,{images:json}, (err, results) => {
                    //     if(err) {
                    //         console.log(err);
                    //     } else {
                    //         console.log(results,'updated');
                            
                    //     }
                    // })
                        
                        

            }
        }


    })
    
    const images=[]
  
    
    for(i=1;i<=4;i++) {
       
        images.push(req.files[`picture${i}`][0].path);
        
    }
    

    console.log(images);
    const json = JSON.stringify(images);
    db.query("INSERT INTO gallery SET ?", {images:json,user_id:0}, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(results, "added");
            
        }
    });

};
    
exports.getGallery = (req, res) => {
    
};