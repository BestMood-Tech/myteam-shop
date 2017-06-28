import { Component, OnInit } from '@angular/core';
import { Auth } from '../shared/services/auth.service';
import { Cart } from '../shared/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  orders: any;
  authorization: boolean;
  cartCurrency = '$';

  constructor(private cart: Cart, private auth: Auth, private router: Router) {
    this.orders = this.cart.getCart();
    this.authorization = this.auth.authenticated();
  }

  public ngOnInit() {
    if (this.auth.user) {
      this.cartCurrency = this.auth.user.currency;
    }
    this.auth.onAuth.subscribe((value) => {
      this.authorization = value;
    });
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
