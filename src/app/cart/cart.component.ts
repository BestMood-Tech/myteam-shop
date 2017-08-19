import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, CartService } from '../shared/services';
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

  constructor(private cart: CartService,
              private auth: AuthService,
              private router: Router) {
    this.orders = this.cart.get();
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
    this.auth.get();
  }


  public deleteProduct(product) {
    this.cart.remove(product);
    this.orders = this.cart.get();
  }

  public getTotalPrice() {
    let price = 0.0;
    this.orders.forEach((item) => {
      price += item.price * item.count;
    });
    return price.toFixed(2);
  }

  public disabledPay(): boolean {
    return !!this.cart.count && this.authorization;
  }

  public checkout() {
    if (!this.disabledPay()) {
      return;
    }
    this.router.navigate(['./checkout']);
  }

}
