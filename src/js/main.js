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

// Popup User-Login
var loginLink = document.querySelector('.user-list__login');

var popupUserLogin = document.querySelector('.modal__login');
var popupClose = popupUserLogin.querySelector('.modal__close-btn');

var login = popupUserLogin.querySelector('[name=login]');
var password = popupUserLogin.querySelector('[name=password]');

// Write Data to Local Storage
var isStorageSupport = true;
var storage = "";

try {
  storage = localStorage.getItem('login');
} catch (err) {
  isStorageSupport = false;
}

// Show Modal on click 'loginLink'
loginLink.addEventListener('click', function (evt) {
  evt.preventDefault();
  popupUserLogin.classList.add('modal--show');

  // Focus on form input
  if (storage) {
    login.value = storage;
    password.focus();
  } else {
    login.focus();
  }
});

// Close Modal on click 'popupClose'
popupClose.addEventListener('click', function (evt) {
  evt.preventDefault();
  popupUserLogin.classList.remove('modal--show');
});

// Close Modal on click 'ESC'
window.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    if (popupUserLogin.classList.contains('modal--show')) {
      popupUserLogin.classList.remove('modal--show');
    }
  }
});

// mockup
