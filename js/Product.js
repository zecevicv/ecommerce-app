import {
  ShoppingCart
} from "./ShoppingCart.js";

export class Product {
  constructor(product) {
    this.name = product.name;
    this.id = product.id;
    this.brand = product.brand;
    this.price = product.price;
    this.salePrice = product.salePrice;
    this.images = product.images;
  }

  static createProductTemplate(product) {
    const productTemplate = document.createElement('DIV');
    productTemplate.className = 'product';
    productTemplate.innerHTML = `
      <figure class="product__img">
        <img src="${product.images[0]}" alt="product-img">
        <div class="product__overlay">
          <div class="product__icons">
            <a href="#" class="product__add-to-cart"><img src="img/icons/cart-orange-rounded.svg" alt="add-to-cart-icon"></a>
            <a href="single-product.html?id=${product.id}"><img src="img/icons/eye-white-rounded.svg" alt="view-product-icon"></a>
          </div>
        </div>
      </figure>
      <div class="product__info">
        <h3 class="product__title">${product.name}</h3>
        <p class="product__price product__price--sale">
          ${product.salePrice === 0 ? `$${product.price}` : `<span class="new-price">$${product.salePrice}</span><span class="old-price">$${product.price}</span>`}
        </p>
      </div>
      ${product.salePrice === 0 ? '' : `<div class="product__sale"><div class="sale-icon">Sale</div></div>`}
      `;
    const addToCartBtn = productTemplate.querySelector('.product__add-to-cart');
    addToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      ShoppingCart.addToShoppingCart(product.id);
    });
    return productTemplate;
  }

  static createSingleProductTemplate(product) {
    const singleProductTemplate = document.createElement('DIV');
    singleProductTemplate.className = 'single-product';
    singleProductTemplate.innerHTML = `
      <div class="container">
        <!-- Product Image -->
        <div class="single-product__image">
          <!-- Image Side -->
          <div class="product-image__side">
            <img src="${product.images[0]}" alt="product-img">
            <img src="${product.images[1]}" alt="product-img">
            <img src="${product.images[2]}" alt="product-img">
          </div>
          <!-- Image Main -->
          <div class="product-image__main">
            <img src="${product.images[0]}" alt="product-img">
          </div>
        </div>
        <!-- Product Info -->
        <div class="single-product__info">
          <div class="single-product__info-left">
            ${product.salePrice === 0 ? '' : `<div class="single-product__sale"><div class="sale-icon">Sale</div></div>`}
            <!-- Title & Price -->
            <div class="single-product__main-info">
              <h3 class="single-product__title">${product.name}</h3>
              ${product.salePrice === 0 ? 
                `<p class="single-product__price">
                  $${product.price}
                </p>` 
              : 
              `<p class="single-product__price single-product__price--sale">
                <span class="new-price">$${product.salePrice}</span>
                <span class="old-price">$${product.price}</span>
              </p>`
              }
            </div>
            <!-- Add To Cart -->
            <div class="single-product__add-to-cart">
              <!-- Quantity -->
              <p>Quantity:</p>
              <div class="d-flex">
                <div class="quantity">
                  <div class="quantity__minus disabled">-</div>
                  <input class="quantity__input" type="number" name="quantity" min="1" max="10" value="1">
                  <div class="quantity__plus">+</div>
                </div>
                <button class="btn btn--orange">Add To Cart</button>
              </div>
            </div>
          </div>
          <div class="single-product__info-right">
            <p class="single-product__id">
              <span>Product ID:</span>
              <span>${product.id}</span>
            </p>
          </div>
        </div>
      </div>`;

    const productImagesSide = singleProductTemplate.querySelector('.product-image__side');
    const productImageMain = singleProductTemplate.querySelector('.product-image__main');
    productImagesSide.addEventListener('mouseover', (e) => {
      const image = e.target.cloneNode(true);
      if (e.target instanceof HTMLImageElement) {
        productImageMain.innerHTML = '';
        productImageMain.appendChild(image);
      }
    });

    return singleProductTemplate;
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


    // Quantity input change
    // Validate entered values
    document.querySelectorAll('.quantity__input').forEach((input) => {
      input.addEventListener('change', (e) => {
        const input = e.currentTarget;
        const min = input.getAttribute('min');
        const max = input.getAttribute('max');

        if (input.value > max) {
          input.value = max;
        } else if (input.value < min) {
          input.value = min;
        }
      });
    })

  }
}