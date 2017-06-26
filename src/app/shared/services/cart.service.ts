import { EventEmitter, Injectable, ViewContainerRef } from '@angular/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

@Injectable()
export class Cart {
  public cart: any;
  public changedCount = new EventEmitter<any>();

  constructor(private toastr: ToastsManager) {
    try {
      if (JSON.parse(localStorage.getItem('cart'))) {
        this.cart = JSON.parse(localStorage.getItem('cart'));
      } else {
        this.cart = [];
      }
    } catch (e) {
      console.log(e);
      this.toastr.error('Failed to get the goods', 'Success!');
    }

    this.updateCartLS(this.cart);
  }

  public addToCart(product) {
    const findProduct = this.cart.find((item) => item.id === product.id && item.type === product.type);
    if (findProduct) {
      findProduct.count += 1;
    } else {
      product.count = 1;
      this.cart.push(product);
    }
    this.changedCount.emit();
    this.updateCartLS(this.cart);
    this.toastr.success(`${product.name} added to cart`, 'Success!');
  }

  public getCart() {
    return this.cart;
  }

  public deleteItem(product) {
    this.toastr.success(`${product.name} is removed cart`, 'Success!');
    const findProduct = this.cart.find((item) => item.id === product.id && item.type === product.type);
    if (findProduct.count > 1) {
      findProduct.count -= 1;
    } else {
      this.cart.splice(this.cart.indexOf(findProduct), 1);
    }
    this.updateCartLS(this.cart);
  }

  public get countCart() {
    let count = 0;
    this.cart.forEach((item) => count += item.count);
    return count;
  }

  public get Total() {
    let price = 0.0;
    this.cart.forEach((item) => {
      price += item.price;
    });
    return price.toFixed(2);
  }

  public clearCart() {
    this.cart = [];
    this.updateCartLS(this.cart);
    this.toastr.success('Cart clear', 'Success!');
  }


  updateCartLS(basket) {
    localStorage.setItem('cart', JSON.stringify(basket));
  }


}
