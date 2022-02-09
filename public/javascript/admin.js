// imageSelect.onchange = evt => {
//     const [file] = imageSelect.files
//     if (file) {
//       image.src = URL.createObjectURL(file)
//     }
// }

const imageSelecter = document.querySelectorAll('#imageSelect')

imageSelecter.forEach((imageSelect,index) => {
  const imagee = document.querySelector(`#image${index}`)
  imageSelect.onchange = evt => {
    console.log(index);
    const [file] = imageSelect.files
    if (file) {
      imagee.src = URL.createObjectURL(file)
    }
  }


})