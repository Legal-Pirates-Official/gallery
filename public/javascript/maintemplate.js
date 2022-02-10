// const imageflow = (image, imagesrc) => {
//     image.onchange = evt => {
//         const [file] = image.files
//         if (file) {
//             imagesrc.src = URL.createObjectURL(file)
//         }
//     }
// }


// imageflow(image1, imagesrc1);
// imageflow(image2, imagesrc2);
// imageflow(image3, imagesrc3);
// imageflow(image4, imagesrc4);


const file = document.querySelector('.file');
file.addEventListener('change', (e) => {
    // Get the selected file
    const [file] = e.target.files;
    // Get the file name and size
    const { name: fileName, size } = file;
    // Convert size in bytes to kilo bytes
    const fileSize = (size / 1000).toFixed(2);
    // Set the text content
    const fileNameAndSize = `${fileName} - ${fileSize}KB`;
    document.querySelector('.file-name').textContent = fileNameAndSize;
});