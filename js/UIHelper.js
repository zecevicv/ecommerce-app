import { Product } from "./Product.js";
import { ShoppingCart } from "./ShoppingCart.js";

export class UIHelper {
  constructor() {
    this.header = document.querySelector('.header');
    this.headerHeight = this.header.offsetHeight;
    this.body = document.querySelector('body');

    this.animateHeader();
  }

  animateHeader() {
    if (this.header.classList.contains('header--transparent')) {
      // If the header is transparent by default animate it on scroll
      window.addEventListener('scroll', () => {
        if(window.scrollY > 0) {
          this.header.classList.remove('header--transparent');
          this.header.classList.add('header--white');
        } else {
          this.header.classList.add('header--transparent');
          this.header.classList.remove('header--white');
        }
      });
    } else {
      // If header is white by default add top padding to the body element
      this.body.style.paddingTop = this.headerHeight + 'px';
    }
  }

  static outputProducts() {
    const productList = document.querySelector('.products__list');
    const productSliders = document.querySelectorAll('.products-slider');
    const singleProduct = document.querySelector('#singleProduct');
    const cart = document.querySelector('.cart');
    const products = JSON.parse(localStorage.getItem('products'));

    // If page has .product__list class
    if (productList) {
      products.forEach((product) => {
        const productTemplate = Product.createProductTemplate(product);
        productList.appendChild(productTemplate);
      });
    }

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
        Product.quantityHandler();
      } else {
        throw Error('Product not found!');
      }

    }

    // Render products to the shopping cart
    if (cart) {
      const shoppingCartOutput = document.querySelector('#shoppingCartOutput');
      let shoppingCartProducts = JSON.parse(localStorage.getItem('shoppingCart'));
      let productsToOutput = [];
      let totalPrice = 0;

      shoppingCartProducts.forEach((item) => {
        productsToOutput.push(products.filter((product) => {
          return product.id === item;
        }));
      });

      productsToOutput.forEach((item) => {
        item = item[0];
        const product = document.createElement('TR');
        product.className = 'cart-product';
        product.innerHTML = `
          <td>
            <img class="cart__product-img" src="${item.images[0]}" alt="product-image">
          </td>
          <td class="cart__product-info">
            <h3 class="cart__product-name">${item.name}</h3>
            <p class="cart__product-id">#${item.id}</p>
          </td>
          <td class="cart__product-quantity">
            <div class="quantity">
              <div class="quantity__minus disabled">-</div>
              <input class="quantity__input" type="number" name="quantity" min="1" max="10" value="1">
              <div class="quantity__plus">+</div>
            </div>
          </td>
          <td class="cart__product-price">
            $${item.salePrice === 0 ? item.price : item.salePrice}
          </td>
          <td>
            <a href="#" class="cart__product-remove">
              <img src="img/icons/dismiss-icon.svg" alt="remove-product-icon">
            </a>
          </td>
        `;
        totalPrice = totalPrice + (item.salePrice === 0 ? item.price : item.salePrice);
        product.addEventListener('click', (e) => {
          e.preventDefault();

          if (e.target.closest('.cart__product-remove')) {
            totalPrice = totalPrice - (item.salePrice === 0 ? item.price : item.salePrice);

            ShoppingCart.removeFromShoppingCart(item.id);
            e.currentTarget.parentNode.removeChild(e.currentTarget);

            UIHelper.renderTotalPrice(totalPrice);
          }

        });
        shoppingCartOutput.appendChild(product);
        UIHelper.renderTotalPrice(totalPrice);
      });
    }

    this.updateShoppingCartNumber();
  }

  static renderTotalPrice(price) {
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
}