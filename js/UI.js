import { Product } from "./Product.js";
import { ShoppingCart } from "./ShoppingCart.js";

export class UI {
  constructor() {
    this.animateHeader();
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
    UI.outputProductList(products);
    UI.outputProductSliders(products);
    UI.outputSingleProduct(products);
    UI.outputCartProducts(products);
  }

  static outputProductList(products) {
    const productList = document.querySelector('.products__list');

    // If page has .product__list class
    if (productList) {
      products.forEach((product) => {
        const productTemplate = Product.createProductTemplate(product);
        productList.appendChild(productTemplate);
      });
    }
  }

  static outputProductSliders(products) {
    const productSliders = document.querySelectorAll('.products-slider');

    // If page has .product-sliders class
    // Grab 4 random products from products array
    // And print them to the screen
    if (productSliders) {
      productSliders.forEach((slider) => {
        for (let i = 0; i < 4; i++) {
          const rnd = Math.floor(Math.random() * 15);

          const productTemplate = Product.createProductTemplate(products[rnd]);
          slider.appendChild(productTemplate);
        }
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

      shoppingCartProducts.forEach((cartProduct) => {
        products.forEach((product) => {
          if(product.id === cartProduct.productId) {
            outputCartProduct(product, cartProduct.quantity);
          }
        })
      });

      // Connect quantityHandler
      UI.quantityHandler();
    }

    // Update shopping cart number indicator
    this.updateShoppingCartNumber();
  }
}