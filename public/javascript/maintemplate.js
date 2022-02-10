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


const cupid = document.querySelector('.cupid');
const maindivs = document.querySelectorAll('.main-divs');
let index = 0;

cupid.addEventListener('click', (e) => {
    maindivs[index].classList.add('main-divs-active');
    index++;
    console.log(index);
})