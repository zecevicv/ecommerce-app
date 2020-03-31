import {
  UI
} from "./UI.js";

export class ShoppingCart {
  static addToShoppingCart(productId, quantity, price) {
    const product = {
      productId: productId,
      quantity: quantity,
      price: price
    }

    if (localStorage.getItem('shoppingCart')) {
      const products = JSON.parse(localStorage.getItem('shoppingCart'));
      if (ShoppingCart.isInTheCart(product)) {
        localStorage.setItem('shoppingCart', JSON.stringify(products));
        UI.showCartNotification('<span class="text-green">&#10004</span> Product already in the cart');
      } else {
        products.push(product);
        localStorage.setItem('shoppingCart', JSON.stringify(products));
        UI.showCartNotification('<span class="text-green">&#10004</span> Product added to the cart');
      }
    } else {
      const products = [];
      products.push(product);
      localStorage.setItem('shoppingCart', JSON.stringify(products));
      UI.showCartNotification('<span class="text-green">&#10004</span> Product added to the cart');
    }

    // Update shopping cart number indicator
    UI.updateShoppingCartNumber();
  }

  static isInTheCart(product) {
    const products = JSON.parse(localStorage.getItem('shoppingCart'));
    let isInTheCart = false;
    products.forEach((prod) => {
      if (parseInt(prod.productId) === parseInt(product.productId)) {
        isInTheCart = true;
      }
    })
    return isInTheCart;
  }

  static removeFromShoppingCart(productId) {
    let products = JSON.parse(localStorage.getItem('shoppingCart'));
    products.forEach((product, index) => {
      if (product.productId === productId) {
        products.splice(index, 1);
      }
    });
    localStorage.setItem('shoppingCart', JSON.stringify(products));

    if (products.length === 0) {
      UI.showCartNoProducts();
    }

    // Update shopping cart number indicator
    UI.updateShoppingCartNumber();
  }

  static updateShoppingCart(productId, quantity) {
    let products = JSON.parse(localStorage.getItem('shoppingCart'));
    products.forEach((product, index) => {
      if (product.productId === productId) {
        products[index].quantity = quantity;
      }
    });
    localStorage.setItem('shoppingCart', JSON.stringify(products));
  }

  static createCartProductTemplate(product, quantity) {
    const cartProduct = document.createElement('TR');
    cartProduct.className = 'cart-product';
    cartProduct.innerHTML = `
      <td>
        <img class="cart__product-img" src="${product.images[0]}" alt="product-image">
      </td>
      <td class="cart__product-info">
        <h3 class="cart__product-name">
          <a href="single-product.html?id=${product.id}">${product.name}</a>
        </h3>
        <p class="cart__product-id">#${product.id}</p>
      </td>
      <td class="cart__product-quantity">
        <div class="quantity">
          <div class="quantity__minus disabled">-</div>
          <input class="quantity__input" type="number" name="quantity" min="1" max="10" value="${quantity}" disabled>
          <div class="quantity__plus">+</div>
        </div>
      </td>
      <td class="cart__product-price">
        $${product.salePrice === 0 ? (product.price * quantity).toFixed(2) : (product.salePrice * quantity).toFixed(2)}
      </td>
      <td>
        <a href="#" class="cart__product-remove">
          <img src="img/icons/dismiss-icon.svg" alt="remove-product-icon">
        </a>
      </td>
    `;

    // Function that updates the product price
    const updateCartProductPrice = (price, quantity) => {
      const priceEl = cartProduct.querySelector('.cart__product-price');
      priceEl.innerHTML = `$${(price * quantity).toFixed(2)}`;
    };

    // Update the quantity of a product in the shoppingCart in localStorage
    const quantityEl = cartProduct.querySelector('.quantity');
    quantityEl.addEventListener('click', (e) => {
      const plus = e.currentTarget.querySelector('.quantity__plus');
      const minus = e.currentTarget.querySelector('.quantity__minus');
      const input  = e.currentTarget.querySelector('.quantity__input');
      const min = input.getAttribute('min');
      const max = input.getAttribute('max');
      if (e.target === plus && quantity < max) {
        quantity++;
        this.updateShoppingCart(product.id, parseInt(quantity));
        if (product.salePrice === 0) {
          updateCartProductPrice(product.price, quantity);
        } else {
          updateCartProductPrice(product.salePrice, quantity);
        }
        ShoppingCart.updateTotalPrice();
      } else if (e.target === minus && quantity > min) {
        quantity--;
        this.updateShoppingCart(product.id, parseInt(quantity));
        if (product.salePrice === 0) {
          updateCartProductPrice(product.price, quantity);
        } else {
          updateCartProductPrice(product.salePrice, quantity);
        }
        ShoppingCart.updateTotalPrice();
      }
    });
    
    // Remove Product Handler
    const removeProductBtn = cartProduct.querySelector('.cart__product-remove');
    removeProductBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const cartProduct = e.target.closest('.cart-product');
      ShoppingCart.removeFromShoppingCart(product.id);
      cartProduct.parentNode.removeChild(cartProduct);
      ShoppingCart.updateTotalPrice();
    });

    ShoppingCart.updateTotalPrice();

    return cartProduct;
  }

  static updateTotalPrice() {
    const totalPriceEl = document.querySelector('.cart__cost .price');

    if (totalPriceEl) {
      let products = JSON.parse(localStorage.getItem('shoppingCart'));
      let totalPrice = 0;
      products.forEach((product) => {
        totalPrice = totalPrice + (parseInt(product.price) * parseInt(product.quantity));
      });
      totalPriceEl.innerHTML = `$${totalPrice.toFixed(2)}`;
    }
  }
}