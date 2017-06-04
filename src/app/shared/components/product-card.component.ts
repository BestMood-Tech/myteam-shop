import { Component, Input, OnInit } from '@angular/core';
import { Cart } from '../services/cart.service';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() public product;
  @Input() public label;

  public productCurrency: any;

  constructor(private _cart: Cart, private _auth: Auth) {}

  public ngOnInit() {
    if (this._auth.user == null) {
      this.productCurrency = '$';
    } else {
      this.productCurrency = this._auth.user.currency;
    }
  }

  public addToCart(product) {
    this._cart.addToCart(product);
  }

  public getLabel() {
    switch (this.product.type) {
      case 'game': return 'label-danger';
      case 'music': return 'label-info';
      case 'movie': return 'label-warning';
      default: return 'label-succes';
    }
  }
}
