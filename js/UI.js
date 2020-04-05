import { Product } from "./Product.js";
import { ShoppingCart } from "./ShoppingCart.js";

export class UI {
  constructor() {
    this.activeFilters = {
      filters: {
        colors: [],
        collections: []
      },
      price: {
        minPrice: 0,
        maxPrice: 50
      }
    };

    this.animateHeader();
    this.initializeChoseUsSlider();

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
    UI.outputProductList({filters: {colors: [], collections: []}, price: {minPrice: 0, maxPrice: 50}});
    UI.outputSingleProduct(products);
    UI.outputCartProducts();
    UI.outputCheckoutProducts();
  }

  static outputProductList(filtersArray) {
    const productList = document.querySelector('.products__list');
    
    if (productList) {
      const products = JSON.parse(localStorage.getItem('products'));
      let productsToOutput = products;
      
      productList.innerHTML = '';

      // Price filter
      if (filtersArray.price.minPrice > 0 || filtersArray.price.maxPrice < 50) {
        productsToOutput = productsToOutput.filter((product) => {
          return ((parseInt(product.salePrice) === 0 ? parseInt(product.price) : parseInt(product.salePrice)) > parseInt(filtersArray.price.minPrice)) && ((parseInt(product.salePrice) === 0 ? parseInt(product.price) : parseInt(product.salePrice)) < parseInt(filtersArray.price.maxPrice));
        })
      }

      // Color filter
      if (filtersArray.filters.colors.length > 0) {
        productsToOutput = productsToOutput.filter((product) => {
          return (filtersArray.filters.colors.includes(product.color));
        });
      }

      // Collections filter
      if (filtersArray.filters.collections.length > 0) {
        productsToOutput = productsToOutput.filter((product) => {
          return (filtersArray.filters.collections.includes(product.gender));
        });
      }

      // Output all products
      if (productsToOutput.length > 0) {
        for (let i = 0; i < productsToOutput.length; i++) {
          if (productsToOutput[i]) {
            const productTemplate = Product.createProductTemplate(productsToOutput[i]);
            productList.appendChild(productTemplate);
          }
        }
      } else {
        const text = document.createElement('P');
        text.innerHTML = 'No products match your search criteria';
        productList.appendChild(text);
      }

      document.querySelector('.products__heading .number').innerHTML = `(${productsToOutput.length})`;
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
      const checkoutBtn = document.querySelector('#checkoutBtn');

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
        checkoutBtn.classList.remove('disabled');
      } else {
        if (!shoppingCartNoProduct.classList.contains('display')) {
          shoppingCartNoProduct.classList.add('display');
        }
        if (shoppingCartTable.classList.contains('display')) {
          shoppingCartTable.classList.remove('display');
        }
        checkoutBtn.classList.add('disabled');
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
      const products = JSON.parse(localStorage.getItem('products'));
      const shoppingCartProducts = JSON.parse(localStorage.getItem('shoppingCart'));
      const checkoutOutput = document.querySelector('#checkoutOutput');
      const totalPrice = document.querySelector('#totalPrice');

      if (shoppingCartProducts && shoppingCartProducts.length > 0) {
        let sum = 0;
        shoppingCartProducts.forEach((cartProduct) => {
          products.forEach((product) => {
            if (product.id === cartProduct.productId) {
              const productEL = document.createElement('DIV');
              productEL.className = 'checkout__product';
              productEL.innerHTML = `
                <img src="${product.images[0]}" alt="product-img">
                <h4>${product.name}</h4>
                <div class="checkout__product-quantity">x${cartProduct.quantity}</div>
                <div class="checkout__product-price">$${(cartProduct.price * cartProduct.quantity).toFixed(2)}</div>`;
              checkoutOutput.appendChild(productEL);
              sum = sum + (cartProduct.price * cartProduct.quantity);
            }
          })
        });
        totalPrice.innerHTML = `$${sum.toFixed(2)}`;
      }
    }
  }

  static disableCheckoutBtn() {
    const checkoutBtn = document.querySelector('#checkoutBtn');
    checkoutBtn.classList.add('disabled');
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
        this.activeFilters.price.maxPrice = inputMax.value;
        this.addToFiltersArray(0, 'price');
      } else {
        inputMin.value = value;
        this.activeFilters.price.minPrice = inputMin.value;
        this.addToFiltersArray(0, 'price');
      }
    });

    inputMin.addEventListener('change', () => {
      priceSlider.noUiSlider.set([inputMin.value, null]);
      this.activeFilters.price.minPrice = inputMin.value;
      this.addToFiltersArray(0, 'price');
    });

    inputMax.addEventListener('change', () => {
      priceSlider.noUiSlider.set([null, inputMax.value]);
      this.activeFilters.price.maxPrice = inputMax.value;
      this.addToFiltersArray(0, 'price');
    });
  }

  addToFiltersArray(filter, filterType) {
    if (filter !== 0) {
      if (filterType === 'color') {
        if (!this.activeFilters.filters.colors.includes(filter)) {
          this.activeFilters.filters.colors.push(filter);
        } else {
          this.activeFilters.filters.colors = this.activeFilters.filters.colors.filter((item) => item !== filter);
        } 
      } else if (filterType === 'collection') {
        if (!this.activeFilters.filters.collections.includes(filter)) {
          this.activeFilters.filters.collections.push(filter);
        } else {
          this.activeFilters.filters.collections = this.activeFilters.filters.collections.filter((item) => item !== filter);
        } 
      }
    }
    UI.outputProductList(this.activeFilters);
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
        const inputMin = document.getElementById('inputMin');
        const inputMax = document.getElementById('inputMax');

        // Toggle the filter body
        if (e.target.closest('.filter__heading') && viewportWidth > 991) {
          filter.classList.toggle('display');
        }

        // Filter color handler
        if (e.target.closest('.filter__color')) {
          const filterColor = e.target.closest('.filter__color');
          filterColor.classList.toggle('active');
          const color = filterColor.id;
          this.addToFiltersArray(color, 'color');
        }

        // Filter collection handler
        if (e.target.closest('.checkbox label')) {
          const filterCollection = e.target.closest('.checkbox label');
          const collection = filterCollection.getAttribute('for');
          this.addToFiltersArray(collection, 'collection');
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