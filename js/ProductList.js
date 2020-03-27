import { Product } from './Product.js';
import { UI } from './UI.js';

export class ProductList {
  constructor() { 
    this.productList = [];
    // Check if products are in localStorage
    // If not fetch them
    if(!localStorage.getItem('products')) {
      this.fetchProducts();
    } else {
      UI.outputProducts();
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
      this.productList = this.createProductList(products);
      this.storeProducts();
      UI.outputProducts();
    });
  }

  // Create a list of products
  createProductList(products) {
    const prodList = [];

    // Create new product object and populate the object
    products.forEach((product) => {
      prodList.push(new Product(product));
    });

    return prodList;
  }

  // Store products in localStorage
  storeProducts() {
    localStorage.setItem('products', JSON.stringify(this.productList));
  }
}