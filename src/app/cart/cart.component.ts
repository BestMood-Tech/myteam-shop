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
  autorization: boolean;
  cartCurrency = "$";

  constructor(private cart: Cart, private auth: Auth, private router: Router) {
    this.orders = this.cart.getCart();
    this.autorization = this.auth.authenticated();
  }

  ngOnInit() {
    if(this.auth.user) this.cartCurrency = this.auth.user.currency;

    this.auth.onAuth.subscribe((value) => {
      this.autorization = value;
    });
  }


  deleteProduct(key) {
    this.cart.deleteItem(key);
    this.orders = this.cart.getCart();
  }

  getTotalPrice() {
    let price = 0.0;
    this.orders.forEach((item) => {
      price += item.price;
    });
    return price.toFixed(2);
  }

  disabledPay():boolean {
    return !!this.cart.countCart && this.autorization;
  }


  checkout() {
    if(!this.disabledPay()) return;
    this.router.navigate(['./checkout']);
  }

}
