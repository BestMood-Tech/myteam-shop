import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';

import { baseUrl, bucketUrl, setOptions } from '../helper';
import { Product } from '../models';

@Injectable()
export class CartService {
  constructor(private toastsManager: ToastsManager,
              private http: HttpClient) {
  }

  public add(products: Product[], addedProduct: Product): Observable<Product[]> {
    const foundProduct = products.find((item: Product) => item.id === addedProduct.id && item.type === addedProduct.type);
    let newProducts: Product[];
    if (foundProduct) {
      const foundIndex = products.indexOf(foundProduct);
      const editedProduct = { ...foundProduct,  count: foundProduct.count + 1 };
      newProducts = [...products.slice(0, foundIndex), editedProduct, ...products.slice(foundIndex + 1)];
    } else {
      newProducts = [...products, { ...addedProduct, count: 1 }];
    }
    return this.update(newProducts)
      .map((data: Product[]) => {
        this.toastsManager.success(`Product ${addedProduct.name} added to cart`, 'Success!');
        return data;
      })
  }

  public get(): Observable<Product[]> {
    try {
      if (localStorage.getItem('cart')) {
        return Observable.of(JSON.parse(localStorage.getItem('cart')));
      } else {
        return this.update([])
      }
    } catch (error) {
      console.log(error);
      this.toastsManager.error('Failed to get the goods!', 'Error!');
      return Observable.throw('Failed to get the goods!')
    }
  }

  public remove(products: Product[], removedProduct: Product): Observable<Product[]> {
    const foundProduct = products.find((item) => item.id === removedProduct.id && item.type === removedProduct.type);
    const foundIndex = products.indexOf(foundProduct);
    let newProducts: Product[];
    if (foundProduct.count > 1) {
      const editedProduct = { ...foundProduct,  count: foundProduct.count - 1 };
      newProducts = [...products.slice(0, foundIndex), editedProduct, ...products.slice(foundIndex + 1)]
    } else {
      newProducts = [...products.slice(0, foundIndex), ...products.slice(foundIndex + 1)];
    }
    return this.update(newProducts)
      .map((data: Product[]) => {
        this.toastsManager.success(`${removedProduct.name} is removed from cart`, 'Success!');
        return data;
      });
  }

  public clear(): Observable<Product[]> {
    return this.update([]);
  }

  public printInvoice(id: string): Observable<string> {
    this.toastsManager.warning('Your invoice is processing...', 'Processing');
    return this.http.get(`${baseUrl}api/invoice/print/${id}`, setOptions())
      .map(() => `${bucketUrl}${id}`);
  }

  private update(products: Product[]): Observable<Product[]> {
    try {
      localStorage.setItem('cart', JSON.stringify(products));
      return Observable.of(products);
    } catch (error) {
      return Observable.throw('Failed to update cart!');
    }
  }
}
