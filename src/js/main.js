var navMain = document.querySelector('.main-nav');
var navToggle = document.querySelector('.main-nav__toggle');

// Main Navigation without JS
navMain.classList.remove('main-nav--nojs');

// Main Navigation Toggle on Mobile
navToggle.addEventListener('click', function () {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
  }
});
