import {
  Product
} from "./Product.js";
import {
  ShoppingCart
} from "./ShoppingCart.js";

export class UI {
  constructor() {
    this.currentPage = 0;

    this.animateHeader();
    this.initializeChoseUsSlider();
    this.paginationHandler();

    if (document.querySelector('.products')) {
      this.initializePriceSlider();
      this.filtersHandler();
    }
  }

  animateHeader() {
    const header = document.querySelector('.header');
    const headerHeight = header.offsetHeight;
    const body = document.querySelector('body');

    if (header.classList.contains('header--transparent')) {
      // If the header is transparent by default animate it on scroll
      window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
          header.classList.remove('header--transparent');
          header.classList.add('header--white');
        } else {
          header.classList.add('header--transparent');
          header.classList.remove('header--white');
        }
      });
      if (window.scrollY > 0) {
        header.classList.remove('header--transparent');
        header.classList.add('header--white');
      } else {
        header.classList.add('header--transparent');
        header.classList.remove('header--white');
      }
    } else {
      // If header is white by default add top padding to the body element
      body.style.paddingTop = headerHeight + 'px';
    }
  }

  static updateShoppingCartNumber() {
    const numberUI = document.querySelector('.shopping-cart__number');
    if (numberUI && localStorage.getItem('shoppingCart')) {
      let number = JSON.parse(localStorage.getItem('shoppingCart')).length;
      numberUI.innerHTML = number;
    } else {
      numberUI.innerHTML = 0;
    }
  }

  static quantityHandler() {
    this.quantity = document.querySelectorAll('.quantity');

    // Click Handlers
    this.quantity.forEach((qty) => {
      qty.addEventListener('click', (e) => {
        const plus = e.currentTarget.querySelector('.quantity__plus');
        const minus = e.currentTarget.querySelector('.quantity__minus');
        const input = e.currentTarget.querySelector('.quantity__input');
        const min = input.getAttribute('min');
        const max = input.getAttribute('max');

        if (e.target === plus && parseInt(input.value) < max) {
          input.value = parseInt(input.value) + 1;
        } else if (e.target === minus && parseInt(input.value) > min) {
          input.value = parseInt(input.value) - 1;
        }

        if (parseInt(input.value) == max) {
          plus.classList.add('disabled');
        } else {
          plus.classList.remove('disabled');
        }

        if (parseInt(input.value) == min) {
          minus.classList.add('disabled');
        } else {
          minus.classList.remove('disabled');
        }
      });

    });
  }

  static outputProducts() {
    const products = JSON.parse(localStorage.getItem('products'));
    UI.outputProductSliders();
    UI.outputProductList(0);
    UI.outputSingleProduct(products);
    UI.outputCartProducts();
  }

  static outputProductList(currentPage) {
    const productList = document.querySelector('.products__list');

    if (productList) {
      productList.innerHTML = '';
      const products = JSON.parse(localStorage.getItem('products'));
      const productsPerPage = 9;

      for (let i = currentPage * productsPerPage; i < productsPerPage * (currentPage + 1); i++) {
        if (products[i]) {
          const productTemplate = Product.createProductTemplate(products[i]);
          productList.appendChild(productTemplate);
        }
      }
    }
  }

  static outputProductSliders() {
    const productSlider1 = document.querySelector('#productSlider1');
    const productSlider2 = document.querySelector('#productSlider2');
    const productSlider3 = document.querySelector('#productSlider3');

    // Products on sale slider
    if (productSlider1) {
      let slider1 = new Swiper(productSlider1, {
        slidesPerView: 4,
        spaceBetween: 40,
        loop: true,

        autoplay: {
          delay: 5000,
          disableOnInteraction: true,
        },

        breakpoints: {
          0: {
            slidesPerView: 2,
            autoplay: false,
            spaceBetween: 15
          },
          767: {
            slidesPerView: 3,
            autoplay: false,
            spaceBetween: 30
          },
          991: {
            autoplay: true
          },
        },

        navigation: {
          nextEl: '#productSliderWrapper1 .swiper-button-next',
          prevEl: '#productSliderWrapper1 .swiper-button-prev',
        },
      });
    }

    // Hot & Trending products slider
    if (productSlider2) {
      let slider2 = new Swiper(productSlider2, {
        slidesPerView: 4,
        spaceBetween: 40,
        loop: true,

        autoplay: {
          delay: 5000,
          disableOnInteraction: true,
        },

        breakpoints: {
          0: {
            slidesPerView: 2,
            autoplay: false,
            spaceBetween: 15
          },
          767: {
            slidesPerView: 3,
            autoplay: false,
            spaceBetween: 30
          },
          991: {
            autoplay: true
          },
        },

        navigation: {
          nextEl: '#productSliderWrapper2 .swiper-button-next',
          prevEl: '#productSliderWrapper2 .swiper-button-prev',
        },
      });
    }

    // Related Products slider
    if (productSlider3) {
      let slider3 = new Swiper(productSlider3, {
        slidesPerView: 4,
        spaceBetween: 40,
        loop: true,

        autoplay: {
          delay: 5000,
          disableOnInteraction: true,
        },

        breakpoints: {
          0: {
            slidesPerView: 2,
            autoplay: false,
            spaceBetween: 15
          },
          767: {
            slidesPerView: 3,
            autoplay: false,
            spaceBetween: 30
          },
          991: {
            autoplay: true
          },
        },

        navigation: {
          nextEl: '#productSliderWrapper3 .swiper-button-next',
          prevEl: '#productSliderWrapper3 .swiper-button-prev',
        },
      });
    }
  }

  static outputSingleProduct(products) {
    const singleProduct = document.querySelector('#singleProduct');

    // If we are on the single-product.html page
    if (singleProduct) {

      // Get the id from query parameter
      const singleProductId = parseInt(window.location.search.replace('?id=', ''));
      // Filter products array and find the one that matches
      const product = products.filter((product) => {
        return product.id === singleProductId;
      })[0];

      if (product) {
        const singleProductTemplate = Product.createSingleProductTemplate(product);
        singleProduct.appendChild(singleProductTemplate);
        UI.quantityHandler();
        UI.singleProductImageSlider();
      } else {
        throw Error('Product not found!');
      }
    }
  }

  static outputCartProducts() {
    const cart = document.querySelector('.cart');

    // Render products to the shopping cart
    if (cart) {
      const products = JSON.parse(localStorage.getItem('products'));
      const shoppingCartOutput = document.querySelector('#cartOutput');
      const shoppingCartProducts = JSON.parse(localStorage.getItem('shoppingCart'));
      const shoppingCartNoProduct = document.querySelector('#cartNoProducts');
      const shoppingCartTable = document.querySelector('#cartTable');

      const outputCartProduct = (item, quantity) => {
        const cartProductTemplate = ShoppingCart.createCartProductTemplate(item, parseInt(quantity));
        // Render the idem to the UI
        shoppingCartOutput.appendChild(cartProductTemplate);
      }

      if (shoppingCartProducts && shoppingCartProducts.length > 0) {
        if (shoppingCartNoProduct.classList.contains('display')) {
          shoppingCartNoProduct.classList.remove('display');
        }
        if (!shoppingCartTable.classList.contains('display')) {
          shoppingCartTable.classList.add('display');
        }
        shoppingCartProducts.forEach((cartProduct) => {
          products.forEach((product) => {
            if (product.id === cartProduct.productId) {
              outputCartProduct(product, cartProduct.quantity);
            }
          })
        });
      } else {
        if (!shoppingCartNoProduct.classList.contains('display')) {
          shoppingCartNoProduct.classList.add('display');
        }
        if (shoppingCartTable.classList.contains('display')) {
          shoppingCartTable.classList.remove('display');
        }
      }

      // Connect quantityHandler
      UI.quantityHandler();
    }

    // Update shopping cart number indicator
    this.updateShoppingCartNumber();
  }

  static outputCheckoutProducts() {
    const checkout = document.querySelector('.checkout');

    if (checkout) {
      
    }
  }

  initializeChoseUsSlider() {
    const choseUsSliderEl = document.querySelector('#choseUsSlider');

    if (choseUsSliderEl) {
      let choseUsSlider = new Swiper(choseUsSliderEl, {
        autoplay: {
          delay: 5000,
          disableOnInteraction: true,
        },
        pagination: {
          el: '.swiper-pagination',
        },
        loop: true,
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 0,
            noSwiping: false,
            allowSlidePrev: true,
            allowSlideNext: true,
          },
          585: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          991: {
            slidesPerView: 4,
            spaceBetween: 40,
            noSwiping: true,
            allowSlidePrev: false,
            allowSlideNext: false,
            pagination: ''
          },
        }
      });
    }
  }

  paginationHandler() {
    const pagination = document.querySelector('.pagination');

    if (pagination) {
      pagination.addEventListener('click', (e) => {
        const buttons = pagination.querySelectorAll('button');
        let currentPage = parseInt(e.target.innerHTML) - 1;

        if (e.target.closest('.page')) {
          currentPage = parseInt(e.target.innerHTML) - 1;
          this.scrollToTop();
          buttons.forEach((button) => {
            button.classList.remove('active');
          });
          e.target.classList.add('active');
          setTimeout(() => {
            UI.outputProductList(currentPage);
          }, 800);
        }
      });
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  static showCartNotification(message) {
    const cartNotification = document.querySelector('#cartNotification');
    const cartNotificationMessage = document.querySelector('#cartNotificationMessage');

    cartNotificationMessage.innerHTML = message;

    cartNotification.classList.add('display');
    setTimeout(() => {
      cartNotification.classList.remove('display');
    }, 2500);
  }

  static showCartNoProducts() {
    const shoppingCartTable = document.querySelector('#cartTable');
    const shoppingCartNoProduct = document.querySelector('#cartNoProducts');

    shoppingCartNoProduct.classList.add('display');
    shoppingCartTable.classList.remove('display');
  }

  initializePriceSlider() {
    const priceSlider = document.getElementById('priceSlider');
    const inputMin = document.getElementById('inputMin');
    const inputMax = document.getElementById('inputMax');

    // Initialize Slider
    noUiSlider.create(priceSlider, {
      start: [0, 50],
      connect: true,
      range: {
        'min': 0,
        'max': 50
      }
    });

    priceSlider.noUiSlider.on('update', (values, handle) => {
      let value = values[handle];

      if (handle) {
        inputMax.value = value;
      } else {
        inputMin.value = value;
      }
    });

    inputMin.addEventListener('change', () => {
      priceSlider.noUiSlider.set([inputMin.value, null]);
    });

    inputMax.addEventListener('change', () => {
      priceSlider.noUiSlider.set([null, inputMax.value]);
    });
  }

  filtersHandler() {
    const filters = document.querySelectorAll('.filter');
    const productFilters = document.querySelectorAll('.products__filters');
    const filterToggler = document.querySelector('.product__filter-toggler');
    const viewportWidth = document.documentElement.clientWidth;

    filters.forEach((filter) => {
      filter.addEventListener('click', (e) => {
        const filter = e.currentTarget;
        const filterHeading = filter.querySelector('.filter__heading');
        const filterBody = filter.querySelector('.filter__body');

        // Toggle the filter body
        if (e.target.closest('.filter__heading') && viewportWidth > 991) {
          filter.classList.toggle('display');
        }

        // Filter color handler
        if (e.target.closest('.filter__color')) {
          const filterColor = e.target.closest('.filter__color');
          filterColor.classList.toggle('active');
        }
      });
    });

    if (filterToggler && viewportWidth < 992) {
      filterToggler.addEventListener('click', () => {
        productFilters.forEach((item) => {
          item.classList.toggle('display');
          document.body.classList.toggle('no-scroll');
        });
      });
    }
  }

  static singleProductImageSlider() {
    let galleryThumbs = new Swiper('.gallery-thumbs', {
      spaceBetween: 10,
      slidesPerView: 3,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      direction: 'vertical',
      noSwiping: true,
      allowSlidePrev: false,
      allowSlideNext: false
    });

    let galleryTop = new Swiper('.gallery-top', {
      fade: true,
      effect: 'fade',
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: galleryThumbs
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        hide: false,
      },
      breakpoints: {
        0: {
          loop: false
        },
        575: {
          loop: true
        },
      },
    });
  }
}