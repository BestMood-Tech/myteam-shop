import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth } from '../shared/services/auth.service';
import { Cart } from '../shared/services/cart.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  orders:any;
  autorization:boolean = false;

  constructor(private cart: Cart, private auth: Auth) {
    this.orders = this.cart.getBasket();
  }

  ngOnInit() {
    this.auth.onAuth.subscribe((value) => {
      this.autorization = value;
    });
  }


  deleteProduct(key) {
    this.cart.deleteItem(key);
    this.orders = this.cart.getBasket();
  }

  getTotalPrice() {
    let price = 0.0;
    this.orders.forEach((item) => {
      price += item.price;
    });
    return price;
  }


}
