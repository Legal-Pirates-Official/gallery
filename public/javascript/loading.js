const load = document.querySelector('.loadmain');
window.onload = () => {
    load.style.display = 'flex';
}
const close = document.querySelector('.close');
close.addEventListener('click', () => {
    load.style.display = 'none';
})