import { Injectable } from '@angular/core';

@Injectable()
export class Basket {
  basket: any;

  constructor() {
    try {
      if (JSON.parse(localStorage.getItem('basket')))
        this.basket = JSON.parse(localStorage.getItem('basket'));
      else this.basket = [];
    }
    catch (e) {
      console.log(e);
    }

    this.updateBasketLS(this.basket);
  }

  public addBasket(product) {
    this.basket.push(product);
    this.updateBasketLS(this.basket);
  }

  public getBasket() {
    return this.basket;
  }

  public deleteItem(key) {
    this.basket.splice(key,1);
    this.updateBasketLS(this.basket);
  }

  updateBasketLS(basket) {
    localStorage.setItem('basket',JSON.stringify(basket));
  }

}
