import { UIHelper } from "./UIHelper.js";

export class ShoppingCart {
  static addToShoppingCart(productId) {
    if (localStorage.getItem('shoppingCart')) {
      let products = JSON.parse(localStorage.getItem('shoppingCart'));
      if (products.includes(productId)) {
        console.log('Product already added');
      } else {
        products.push(productId);
        localStorage.setItem('shoppingCart', JSON.stringify(products));
      }
    } else {
      const products = [];
      products.push(productId);
      localStorage.setItem('shoppingCart', JSON.stringify(products));
    }

    UIHelper.updateShoppingCartNumber();
  }

  static removeFromShoppingCart(productId) {
    let products = JSON.parse(localStorage.getItem('shoppingCart'));
    if (products.includes(productId)){
      products = products.filter((product) => {
        return product != productId;
      });
      localStorage.setItem('shoppingCart', JSON.stringify(products));
    }
  }
}