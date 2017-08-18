import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Cart } from '../shared/services';
import { Profile } from '../shared/models/profile.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public orders: any;
  public authorization: boolean;
  public cartCurrency = '$';

  constructor(private cart: Cart,
              private auth: AuthService,
              private router: Router) {
    this.orders = this.cart.getCart();
    this.authorization = this.auth.isAuthenticated;
  }

  public ngOnInit() {
    this.auth.profile.subscribe((user: Profile) => {
      if (user) {
        this.cartCurrency = user.currency;
      } else {
        this.cartCurrency = '$';
      }
    });
    this.auth.getProfile();
  }


  public deleteProduct(product) {
    this.cart.deleteItem(product);
    this.orders = this.cart.getCart();
  }

  public getTotalPrice() {
    let price = 0.0;
    this.orders.forEach((item) => {
      price += item.price * item.count;
    });
    return price.toFixed(2);
  }

  public disabledPay(): boolean {
    return !!this.cart.countCart && this.authorization;
  }

  public checkout() {
    if (!this.disabledPay()) {
      return;
    }
    this.router.navigate(['./checkout']);
  }

}
