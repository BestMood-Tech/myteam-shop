import { Component, Input } from '@angular/core';
import { Cart } from '../services/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {

  @Input() product;

  constructor(private _cart: Cart) { }

  addToCart(product) {
    this._cart.addToCart(product);
  }
}
