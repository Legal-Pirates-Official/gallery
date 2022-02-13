// const phone = document.querySelector('input[name="phone"]');
const nameinput = document.querySelector('input[name="name"]');


// phone.addEventListener('input', (e) => {
//     var ASCIICode = e.target.value.slice(-1).charCodeAt(0);
//     if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
//         e.target.value = e.target.value.slice(0, -1);
//     }
// });

nameinput.addEventListener('input', (e) => {
    var ASCIICode = e.target.value.slice(-1).charCodeAt(0);
    if ((ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57) && (ASCIICode < 65 || ASCIICode > 90) && (ASCIICode < 97 || ASCIICode > 122))) {
        e.target.value = e.target.value.slice(0, -1);
    }
})


var field = document.querySelector('[name="name"]');

field.addEventListener('keypress', function (event) {
    var key = event.keyCode;
    if (key === 32) {
        event.preventDefault();
    }
});