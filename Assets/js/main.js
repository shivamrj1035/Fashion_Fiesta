
// SHOW MENU

const navMenu = document.getElementById('nav-menu'),
  navToggle = document.getElementById('nav-toggle'),
  navClose = document.getElementById('nav-close');

// MENU SHOW 

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu')
  })
}

//  MENU HIDE

// validate if constant exists
if (navClose) {
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
      slidesPerView: 2,
      spaceBetween: 24,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    992: {
      slidesPerView: 4,
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
// const cartButtons= document.querySelectorAll('.cart__btn');
// const cartCount = document.querySelectorAll('#cartCount');
// cartCount.forEach((count) => {
//   count.innerHTML = 0;
// });

// cartButtons.forEach((cartBtn) => {
//   cartBtn.addEventListener('click', ()=> {
//     cartCount.forEach((count) => {
//       initCount = count.innerHTML;
//       newCount = Number(initCount) + 1;
//       count.innerHTML = newCount;
//     });
//   })
// });

// Function to update cart count
function updateCartCount(count) {
  const cartCountElement = document.getElementById('cartCount');
  cartCountElement.textContent = count;
}

// Function to retrieve cart count from storage
function getCartCountFromStorage() {
  return parseInt(localStorage.getItem('cartCount')) || 0;
}

// Initialize cart count
let cartCount = getCartCountFromStorage();
updateCartCount(cartCount);

// Get reference to the button
const addButtons = document.querySelectorAll('.cart__btn');

// Add event listener to the button
addButtons.forEach((addButton) => {
  addButton.addEventListener('click', () => {
    // Increase the cart count
    cartCount++;
    // Update the cart count element with the new count
    updateCartCount(cartCount);
    // Update cart count in storage
    localStorage.setItem('cartCount', cartCount);
  });
})
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
  }, 5000);
}

showSlides();
autoSwipe();

// Function to show or hide the back to top button based on scroll position
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  var backToTopBtn = document.getElementById("backToTopBtn");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
}


// Function to scroll to the top of the page when back to top button is clicked
function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Function to add an item to the cart table
function addItemToCart(imageSrc, name, price, quantity) {
  var newRow = `
        <tr>
            <td><img src="${imageSrc}" alt="" class="table__img"></td>
            <td>
                <h3 class="table__title">${name}</h3>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
                </td>
            <td><span class="table__price">${price}</span></td>
            <td><input type="number" value="${quantity}" class="quantity"></td>
            <td><span class="table__subtotal">${price * quantity}</span></td>
            <td><i class="fi fi-rs-trash table__trash" onclick="removeItem(this)"></i></td>
            </tr>
            `;
  document.getElementById('cartTable').getElementsByTagName('tbody')[0].insertAdjacentHTML('beforeend', newRow);
  saveCartToStorage(); // Save cart to localStorage after adding item
}

// Function to remove an item from the cart table
function removeItem(element) {
  var row = element.closest('tr');
  row.parentNode.removeChild(row);
  saveCartToStorage(); // Save cart to localStorage after removing item
}

// Function to save cart items to localStorage
function saveCartToStorage() {
  var cartItems = [];
  var rows = document.getElementById('cartTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName('td');
    var item = {
      imageSrc: cells[0].getElementsByTagName('img')[0].src,
      name: cells[1].getElementsByClassName('table__title')[0].textContent,
      price: cells[2].getElementsByClassName('table__price')[0].textContent,
      quantity: cells[3].getElementsByTagName('input')[0].value
    };
    cartItems.push(item);
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Function to load cart items from localStorage
function loadCartFromStorage() {
  var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  cartItems.forEach(function (item) {
    addItemToCart(item.imageSrc, item.name, item.price, item.quantity);
  });
}

loadCartFromStorage();
// Load cart items from localStorage on page load
// Popup
// Function to track scroll events and show popup
window.onscroll = function() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      showPopup();
  }
};

// Function to display the popup
function showPopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "block";
}

// Function to close the popup
function closePopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "none";
}