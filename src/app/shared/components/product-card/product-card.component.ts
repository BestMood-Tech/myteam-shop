import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cart } from '../../services/cart.service';
import { Auth } from '../../services/auth.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes } from '@angular/animations';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() public product;
  @Input() public isCart: boolean;
  @Input() public isSearch: boolean;
  @Output() public deleteFromCart: EventEmitter<any> = new EventEmitter();

  public productCurrency: any;
  public productCover: string;
  public state = 'large';

  constructor(private cart: Cart, private auth: Auth) {}

  public ngOnInit() {
    if (this.auth.user == null) {
      this.productCurrency = '$';
    } else {
      this.productCurrency = this.auth.user.currency;
    }

    this.productCover = this.product.cover;
  }

  public addToCart(product) {
    this.cart.addToCart(product);
  }

  public deleteProduct(product) {
    this.deleteFromCart.emit(product);
  }

  public imgError() {
    this.productCover = `../../assets/${this.product.type}.png`;
  }
}
