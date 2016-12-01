import { Component, OnInit } from '@angular/core';
import { Basket } from '../shared/services/basket.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Auth } from '../shared/services/auth.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  formGroup: FormGroup;
  orders:any;
  autorization:any;

  constructor(private basket: Basket, private formBuilder: FormBuilder, private auth: Auth) {
    this.orders = this.basket.getBasket();
    this.autorization = this.auth.authenticated();
  }

  ngOnInit() {
  }

  deleteProduct(key) {
    this.basket.deleteItem(key);
    this.orders = this.basket.getBasket();
  }

  getTotalPrice() {
    let price = 0.0;
    this.orders.map((item) => {
      price += item.price;
    });
    return price;
  }

}
