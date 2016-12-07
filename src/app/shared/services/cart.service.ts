import { Injectable } from '@angular/core';

@Injectable()
export class Cart {
  cart: any;

  constructor() {
    try {
      if (JSON.parse(localStorage.getItem('cart')))
        this.cart = JSON.parse(localStorage.getItem('cart'));
      else this.cart = [];
    }
    catch (e) {
      console.log(e);
    }

    this.updateCartLS(this.cart);
  }

  public addToCart(product) {
    this.cart.push(product);
    this.updateCartLS(this.cart);
  }

  public getCart() {
    return this.cart;
  }

  public deleteItem(key) {
    this.cart.splice(key, 1);
    this.updateCartLS(this.cart);
  }

  public get countCart() {
    return this.cart.length;
  }

  public get Total() {
    let price = 0.0;
    this.cart.forEach((item) => {
      price += item.price;
    });
    return price.toFixed(2);
  }


  updateCartLS(basket) {
    localStorage.setItem('cart', JSON.stringify(basket));
  }


}
