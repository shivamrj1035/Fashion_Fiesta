// SHOW MENU

const navMenu = document.getElementById('nav-menu'),
navToggle = document.getElementById('nav-toggle'),
navClose = document.getElementById('nav-close');

// MENU SHOW 

if(navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu')
  })
}

//  MENU HIDE

// validate if constant exists
if(navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu')
  })
}
// IMG GALLERY

function imgGallery() {
  const mainImg = document.querySelector('.details__img'),
    smallImg = document.querySelectorAll('.details__small-img');

  smallImg.forEach((img) => {
    img.addEventListener('click', function () {
      mainImg.src = this.src;
    });
  });
}

imgGallery();


// =============== SWIPER CATEGORIES ===============


var swiperCategories = new Swiper('.categories__container ', {
  spaceBetween: 24,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    350: {
      slidesPerView:2,
      spaceBetween: 24,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    992: {
      slidesPerView:4,
      spaceBetween: 24,
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 24,
    },
    1400: {
      slidesPerView: 6,
      spaceBetween: 24,
    },
  },

});


// =====================SWIPER PRODUCTS===============================

var swiperCategories = new Swiper('.new__container ', {
  spaceBetween: 24,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
  },

});






// ==========================Product Tabs============================
const tabs = document.querySelectorAll('[data-target]'),
  tabContents = document.querySelectorAll('[content]');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = document.querySelector(tab.dataset.target);
    tabContents.forEach((tabContent) => {
      tabContent.classList.remove('active-tab');
    });

    target.classList.add('active-tab');

    tabs.forEach((tab) => {
      tab.classList.remove('active-tab');
    });


    tab.classList.add('active-tab');
  });
});


// Add to the cart

function addingToCart(){
  let x= document.getElementById('cartCount');
  let initCount = Number(x.innerHTML);
  let newCount = initCount+1;
  x.innerHTML = newCount;
}

// Carousel JS
let slideIndex = 0;
  const slides = document.querySelectorAll('.carousel-item');
  const totalSlides = slides.length;

  function showSlides() {
    slides.forEach((slide) => {
      slide.style.display = 'none';
    });
    slides[slideIndex].style.display = 'block';
  }

  function prevSlide() {
    slideIndex = (slideIndex - 1 + totalSlides) % totalSlides;
    showSlides();
  }

  function nextSlide() {
    slideIndex = (slideIndex + 1) % totalSlides;
    showSlides();
  }

  function autoSwipe() {
    setInterval(() => {
      nextSlide();
    }, 1000);
  }

  showSlides();
  autoSwipe();