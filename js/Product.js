import {ShoppingCart} from "./ShoppingCart.js";

export class Product {
  constructor(product) {
    this.name = product.name;
    this.id = product.id;
    this.price = product.price;
    this.salePrice = product.salePrice;
    this.images = product.images;
    this.label = product.label;
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
      ${product.salePrice === 0 ? '' : `<div class="product__label"><div class="label-icon label-icon--sale">Sale</div></div>`}
      ${product.label === "hot" ? `<div class="product__label"><div class="label-icon label-icon--hot">Hot</div></div>` : ''}
      ${product.label === "new" ? `<div class="product__label"><div class="label-icon label-icon--new">New</div></div>` : ''}
      `;
    const addToCartBtn = productTemplate.querySelector('.product__add-to-cart');
    addToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      ShoppingCart.addToShoppingCart(product.id, 1, (product.salePrice === 0 ? product.price : product.salePrice));
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
            ${product.salePrice === 0 ? '' : `<div class="single-product__sale"><div class="label-icon label-icon--sale">Sale</div></div>`}
            ${product.label === "hot" ? `<div class="single-product__sale"><div class="label-icon label-icon--hot">Hot</div></div>` : ''}
            ${product.label === "new" ? `<div class="single-product__sale"><div class="label-icon label-icon--new">New</div></div>` : ''}
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
                  <input class="quantity__input" type="number" name="quantity" min="1" max="10" value="1" disabled>
                  <div class="quantity__plus">+</div>
                </div>
                <button class="btn btn--orange" id="addToCart">Add To Cart</button>
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
    const addToCartBtn = singleProductTemplate.querySelector('#addToCart');

    // Update the main image with hovered side image
    productImagesSide.addEventListener('mouseover', (e) => {
      const image = e.target.cloneNode(true);
      if (e.target instanceof HTMLImageElement) {
        productImageMain.innerHTML = '';
        productImageMain.appendChild(image);
      }
    });

    // Listen for a click on a add to cart btn and add product to the cart
    addToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const quantityValue = parseInt(singleProductTemplate.querySelector('.quantity__input').value);
      ShoppingCart.addToShoppingCart(product.id, quantityValue, (product.salePrice === 0 ? product.price : product.salePrice));
    });

    return singleProductTemplate;
  }
}