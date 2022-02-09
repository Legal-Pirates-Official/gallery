const imageflow = (image, imagesrc) => {
    image.onchange = evt => {
        const [file] = image.files
        if (file) {
            imagesrc.src = URL.createObjectURL(file)
        }
    }
}


imageflow(image1, imagesrc1);
imageflow(image2, imagesrc2);
imageflow(image3, imagesrc3);
imageflow(image4, imagesrc4);
