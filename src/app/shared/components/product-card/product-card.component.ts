import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../shared/user.model';
import { Auth, Cart } from '../../services/';

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

  constructor(private cart: Cart, private auth: Auth) {
  }

  public ngOnInit() {
    this.auth.onAuth.subscribe((user: User) => {
      if (!user) {
        this.productCurrency = '$';
        return;
      }
      this.productCurrency = user.currency
    });
    this.auth.getProfile();

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
