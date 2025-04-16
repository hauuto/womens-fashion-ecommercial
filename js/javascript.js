

//hiding navbar
let lastScrollTop = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        navbar.classList.add("hide-navbar"); // Cuộn xuống
    } else {
        navbar.classList.remove("hide-navbar"); // Cuộn lên
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});