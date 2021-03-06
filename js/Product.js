import {
  ShoppingCart
} from "./ShoppingCart.js";

export class Product {
  constructor(product) {
    this.name = product.name;
    this.id = product.id;
    this.price = product.price;
    this.salePrice = product.salePrice;
    this.images = product.images;
    this.label = product.label;
    this.gender = product.gender;
    this.color = product.color;
  }

  static createProductTemplate(product) {
    const productTemplate = document.createElement('A');
    productTemplate.className = 'product';
    productTemplate.setAttribute('href', `single-product.html?id=${product.id}`);
    productTemplate.dataset.gender = product.gender;
    productTemplate.dataset.color = product.color;
    productTemplate.innerHTML = `
      <figure class="product__img">
        <img src="${product.images[0]}" alt="product-img">
      </figure>
      <div class="product__info">
        <h3 class="product__title">${product.name}</h3>
        <p class="product__price product__price--sale">
          ${product.salePrice === 0 ? `$${product.price}` : `<span class="new-price">$${product.salePrice}</span><span class="old-price">$${product.price}</span>`}
        </p>
      </div>
      ${product.salePrice === 0 ? '' : `<div class="product__label"><div class="label-icon label-icon--sale">Sale</div></div>`}
      ${product.label === "hot" ? `<div class="product__label"><div class="label-icon label-icon--hot">Hot</div></div>` : ''}
      ${product.label === "new" ? `<div class="product__label"><div class="label-icon label-icon--new">New</div></div>` : ''}
      `;
    return productTemplate;
  }

  static createSingleProductTemplate(product) {
    const singleProductTemplate = document.createElement('DIV');
    const productColorHex = Product.generateProductColorHex(product.color);
    singleProductTemplate.className = 'single-product';
    singleProductTemplate.innerHTML = `
      <div class="container">
        <!-- Product Image -->
        <div class="single-product__image">
          <div class="swiper-container gallery-top">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <img src="${product.images[0]}">
              </div>
              <div class="swiper-slide">
                <img src="${product.images[1]}">
              </div>
              <div class="swiper-slide">
                <img src="${product.images[2]}">
              </div>
            </div>
            <!-- Add Scrollbar -->
            <div class="swiper-scrollbar"></div>
          </div>
          <div class="swiper-container gallery-thumbs">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <img src="${product.images[0]}">
              </div>
              <div class="swiper-slide">
                <img src="${product.images[1]}">
              </div>
              <div class="swiper-slide">
                <img src="${product.images[2]}">
              </div>
            </div>
          </div>
        </div>
        <!-- Product Info -->
        <div class="single-product__info">
          ${product.salePrice === 0 ? '' : `<div class="single-product__sale"><div class="label-icon label-icon--sale">Sale</div></div>`}
          ${product.label === "hot" ? `<div class="single-product__sale"><div class="label-icon label-icon--hot">Hot</div></div>` : ''}
          ${product.label === "new" ? `<div class="single-product__sale"><div class="label-icon label-icon--new">New</div></div>` : ''}
          <!-- Title & Price -->
          <div class="single-product__main-info">
            <h1 class="single-product__title">${product.name}</h1>
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
          <!-- Color -->
          <div class="single-product__color">
            <p>Color:</p>
            <div class="single-product__color-box">
              <span class="single-product__color-hex" style="background-color: ${productColorHex}"></span>
            </div>
          </div>
          <!-- Add To Cart -->
          <div class="single-product__add-to-cart">
            <!-- Quantity -->
            <p>Quantity:</p>
            <div class="d-flex">
              <div class="quantity">
                <div class="quantity__minus disabled">-</div>
                <input class="quantity__input" type="number" name="quantity" min="1" max="10" value="1" disabled>
                <div class="quantity__plus">+</div>
              </div>
              <button class="btn btn--orange" id="addToCart">Add To Cart</button>
            </div>
          </div>
        </div>
      </div>`;

    const addToCartBtn = singleProductTemplate.querySelector('#addToCart');

    // Listen for a click on a add to cart btn and add product to the cart
    addToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const quantityValue = parseInt(singleProductTemplate.querySelector('.quantity__input').value);
      ShoppingCart.addToShoppingCart(product.id, quantityValue, (product.salePrice === 0 ? product.price : product.salePrice));
    });

    return singleProductTemplate;
  }

  static generateProductColorHex(color) {
    if (color === 'black') {
      return '#000';
    } else if (color === 'white') {
      return '#fff';
    } else if (color === 'red') {
      return '#e53935';
    } else if (color === 'blue') {
      return '#3949AB';
    } else if (color === 'green') {
      return '#43A047';
    } else if (color === 'gray') {
      return '#757575';
    } else if (color === 'yellow') {
      return '#F9A825';
    }
  }
}