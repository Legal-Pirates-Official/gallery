const navbar = document.querySelector(".navbar");
const navbarright = document.querySelector(".navright");

document.querySelector(".header").addEventListener("click", function () {
  navbar.classList.add("active");
  navbarright.classList.add("active2");
  document.querySelector(".navright ul").style.display = "flex";
  document.querySelector(".navright ul").style.transition = "all 2s";
});
document.querySelector(".closebtn").addEventListener("click", function () {
  navbar.classList.remove("active");
  navbarright.classList.remove("active2");
  document.querySelector(".navright ul").style.display = "none";
  document.querySelector(".navright ul").style.transition = "all 2s";
});

var swiper = new Swiper(".mySwiper", {
  loop: true,
  centeredSlides: true,
  slidesPerView: "3",
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: ".swiper-pagination",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
