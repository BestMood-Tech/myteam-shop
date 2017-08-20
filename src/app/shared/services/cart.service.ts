import { EventEmitter, Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';

import { backetUrl, baseUrl, setOptions } from '../helper';
import { Product } from '../models/product.model';

@Injectable()
export class CartService {
  public changedCount = new EventEmitter<any>();
  private cart: Product[];

  constructor(private toastr: ToastsManager, private http: Http) {
    try {
      if (JSON.parse(localStorage.getItem('cart'))) {
        this.cart = JSON.parse(localStorage.getItem('cart'));
      } else {
        this.cart = [];
        this.update();
      }
    } catch (e) {
      console.log(e);
      this.toastr.error('Failed to get the goods', 'Error!');
    }
  }

  public add(product: Product): void {
    const foundProduct = this.cart.find((item) => item.id === product.id && item.type === product.type);
    if (foundProduct) {
      foundProduct.count += 1;
    } else {
      product.count = 1;
      this.cart.push(product);
    }
    this.changedCount.emit();
    this.update();
    this.toastr.success(`${product.name} added to cart`, 'Success!');
  }

  public get(): Product[] {
    return this.cart;
  }

  public remove(product: Product): void {
    const findProduct = this.cart.find((item) => item.id === product.id && item.type === product.type);
    if (findProduct.count > 1) {
      findProduct.count -= 1;
    } else {
      this.cart.splice(this.cart.indexOf(findProduct), 1);
    }
    this.update();
    this.toastr.success(`${product.name} is removed from cart`, 'Success!');
  }

  public get count(): number {
    let count = 0;
    this.cart.forEach((item) => count += item.count);
    return count;
  }

  public get total(): string {
    let price = 0.0;
    this.cart.forEach((item) => {
      price += item.price;
    });
    return price.toFixed(2);
  }

  public clear(): void {
    this.cart = [];
    this.update();
  }

  public printInvoice(id: string): Observable<any> {
    this.toastr.warning('Your invoice is processing', 'Processing');
    return this.http.get(`${baseUrl}api/invoice/print/${id}`, setOptions())
      .map(res => `${backetUrl}${id}`);
  }

  private update(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }
}
