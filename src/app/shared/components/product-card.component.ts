import { Component, Input, OnInit } from '@angular/core';
import { Cart } from '../services/cart.service';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {

  @Input() product;

  public productCurrency: any;

  constructor(private _cart: Cart, private _auth: Auth) {}

  ngOnInit() {
    if(this._auth.user == null) this.productCurrency = "$";
    else this.productCurrency = this._auth.user.currency;
  }

  addToCart(product) {
    this._cart.addToCart(product);
  }
}
