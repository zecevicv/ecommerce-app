import { Product } from "./Product.js";
import { ShoppingCart } from "./ShoppingCart.js";

export class UI {
  constructor() {
    this.currentPage = 0;

    this.animateHeader();
    this.paginationHandler();
  }

  animateHeader() {
    const header = document.querySelector('.header');
    const headerHeight = header.offsetHeight;
    const body = document.querySelector('body');

    if (header.classList.contains('header--transparent')) {
      // If the header is transparent by default animate it on scroll
      window.addEventListener('scroll', () => {
        if(window.scrollY > 0) {
          header.classList.remove('header--transparent');
          header.classList.add('header--white');
        } else {
          header.classList.add('header--transparent');
          header.classList.remove('header--white');
        }
      });
    } else {
      // If header is white by default add top padding to the body element
      body.style.paddingTop = headerHeight + 'px';
    }
  }

  renderTotalPrice(totalPrice) {
    const priceEl = document.querySelector('.price');
    if (priceEl) {
      priceEl.innerHTML = `$${price.toFixed(2)}`;
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
    UI.outputProductList(0);
    UI.outputProductSliders(products);
    UI.outputSingleProduct(products);
    UI.outputCartProducts(products);
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

  static outputProductSliders(products) {
    const productSlider1 = document.querySelector('#productSlider1');
    const productSlider2 = document.querySelector('#productSlider2');
    const productSlider3 = document.querySelector('#productSlider3');

    // Products on sale slider
    if (productSlider1) {
      let numOfProducts = 0;
      for (let i = 0; i < products.length; i++) {
        if (products[i].salePrice > 0 && numOfProducts <= 3) {
          numOfProducts++;
          const productTemplate = Product.createProductTemplate(products[i]);
          productSlider1.appendChild(productTemplate);
        }
      }
    }

    // Hot & Trending products slider
    if (productSlider2) {
      let numOfProducts = 0;
      for (let i = 0; i < products.length; i++) {
        if (products[i].label === "hot" && numOfProducts <= 3) {
          numOfProducts++;
          const productTemplate = Product.createProductTemplate(products[i]);
          productSlider2.appendChild(productTemplate);
        }
      }
    }

    // Related Products slider
    if (productSlider3) {
      let rndNums = [];

      let runs = 0;
      for (let i = 0; i < 100; i++) {
        const rnd = Math.floor(Math.random() * 15);
        if (!rndNums.includes(rnd) && runs <= 3) {
          runs++;
          rndNums.push(rnd);
        }
      }

      for (let i = 0; i < rndNums.length; i++) {
        const productTemplate = Product.createProductTemplate(products[rndNums[i]]);
        productSlider3.appendChild(productTemplate);
      }
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
      } else {
        throw Error('Product not found!');
      }
    }
  }

  static outputCartProducts(products) {
    const cart = document.querySelector('.cart');

    // Render products to the shopping cart
    if (cart) {
      const shoppingCartOutput = document.querySelector('#shoppingCartOutput');
      const shoppingCartProducts = JSON.parse(localStorage.getItem('shoppingCart'));
      
      const outputCartProduct = (item, quantity) => {
        const cartProductTemplate = ShoppingCart.createCartProductTemplate(item, parseInt(quantity));
        // Render the idem to the UI
        shoppingCartOutput.appendChild(cartProductTemplate);
      }

      if (shoppingCartProducts) {
        shoppingCartProducts.forEach((cartProduct) => {
          products.forEach((product) => {
            if(product.id === cartProduct.productId) {
              outputCartProduct(product, cartProduct.quantity);
            }
          })
        });
      }

      // Connect quantityHandler
      UI.quantityHandler();
    }

    // Update shopping cart number indicator
    this.updateShoppingCartNumber();
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
}