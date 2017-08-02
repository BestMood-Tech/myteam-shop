import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, Cart } from '../shared/services';
import { User } from '../shared/user.model';

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
              private auth: Auth,
              private router: Router) {
    this.orders = this.cart.getCart();
    this.authorization = this.auth.authenticated();
  }

  public ngOnInit() {
    this.auth.onAuth.subscribe((user: User) => {
      if (user) {
        this.cartCurrency = user.currency;
      } else {
        this.cartCurrency = '$';
      }
      this.authorization = !!user;
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
