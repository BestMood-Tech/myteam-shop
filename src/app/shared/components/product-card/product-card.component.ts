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
  styleUrls: ['./product-card.component.scss'],
  animations: [
    trigger('buyAnimations', [
      state('small', style({
        transform: 'scale(1)'
      })),
      state('large', style({
        transform: 'scale(1)'
      })),
      transition('large <=> small', animate('500ms ease-in', keyframes([
        style({opacity: 1, 'z-index': 100, position: 'fixed', transform: 'scale(1)', offset: 0}),
        style({opacity: 0, 'z-index': 100, position: 'fixed', transform: 'scale(0.1)', top: '0px', right: '200px', offset: 1})
      ])))
    ])
  ]
})
export class ProductCardComponent implements OnInit {

  @Input() public product;
  @Input() public isCart: boolean;
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
    const parent = document.getElementById('card');
    const offsetLeft = parent.offsetLeft;
    const offsetTop = parent.offsetTop;
    // const clone = parent.cloneNode().
    // this.state = (this.state === 'small' ? 'large' : 'small');
  }

  public deleteProduct(product) {
    this.deleteFromCart.emit(product);
  }

  public getLabel() {
    switch (this.product.type) {
      case 'game': return 'label-danger';
      case 'book': return 'label-info';
      case 'movie': return 'label-warning';
      default: return 'label-succes';
    }
  }
  public imgError() {
    this.productCover = `../../assets/${this.product.type}.png`;
  }
}
