import { Product } from './Product.js';
import { UIHelper } from './UIHelper.js';

export class ProductList {
  constructor() { 
    // Check if products are in localStorage
    // If not fetch them
    if(!localStorage.getItem('products')) {
      this.fetchProducts();
    } else {
      UIHelper.outputProducts();
    }
  }

  // Fetch Products and push them to localStorage
  fetchProducts() {
    fetch('../products.json')
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        return response.json()
        .then((errData) => {
          console.log(errData);
          throw new Error('Something went wrong - server-side.');
        })
      }
    }).catch((error) => {
      console.log(error);
      throw new Error('Something went wrong!');
    }).then((responseData) => {
      const products = responseData.products;
      const productList = [];

      // Create new product object and push it to the productList array
      products.forEach((product) => {
        productList.push(new Product(product));
      });

      // Store products in localStorage
      localStorage.setItem('products', JSON.stringify(productList));

      // Render Products to the UI
      UIHelper.outputProducts();
    });
  }
}