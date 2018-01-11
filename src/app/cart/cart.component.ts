import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { Product, Profile } from '../shared/models';
import { AuthService } from '../shared/services';
import { AppState } from '../store/app.state';
import { getCart, getCartCount } from '../store/cart/cart.state';
import * as CartActions from '../store/cart/cart.action';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.component.html',
  styleUrls: ['cart.component.scss']
})
export class CartComponent implements OnInit {

  public products: Product[];
  public authorization: boolean;
  public cartCurrency: string;
  public count: number;

  constructor(private store: Store<AppState>,
              private authService: AuthService,
              private router: Router) {
    this.authorization = this.authService.isAuthenticated;
  }

  public ngOnInit() {
    this.authService.profile
      .subscribe((profile: Profile) => this.cartCurrency = profile ? profile.currency : '$');
    this.store.select(getCart)
      .subscribe((products: Product[]) => this.products = products);
    this.store.dispatch(new CartActions.RequestCart());
    this.store.select(getCartCount)
      .subscribe((count) => this.count = count);
    this.authService.get();
  }


  public deleteProduct(product: Product) {
    this.store.dispatch(new CartActions.RemoveFromCart(product));
  }

  public getTotalPrice() {
    let price = 0.0;
    this.products.forEach((item) => {
      price += item.price * item.count;
    });
    return price.toFixed(2);
  }

  public disabledPay(): boolean {
    return !!this.count && this.authorization;
  }

  public checkout() {
    if (!this.disabledPay()) {
      return;
    }
    this.router.navigate(['./checkout']);
  }

}
