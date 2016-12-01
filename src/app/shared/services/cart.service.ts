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

    this.updateBasketLS(this.cart);
  }

  public addBasket(product) {
    this.cart.push(product);
    this.updateBasketLS(this.cart);
  }

  public getBasket() {
    return this.cart;
  }

  public deleteItem(key) {
    this.cart.splice(key,1);
    this.updateBasketLS(this.cart);
  }

  public get countCart() {
    return this.cart.length;
  }


  updateBasketLS(basket) {
    localStorage.setItem('cart',JSON.stringify(basket));
  }

}
