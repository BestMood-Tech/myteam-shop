import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Store } from '@ngrx/store';

import { Product, Profile } from '../../models';
import { AuthService } from '../../services/';
import { AppState } from '../../../store/app.state';
import * as CartActions from '../../../store/cart/cart.action';

@Component({
  selector: 'app-product-card',
  templateUrl: 'product-card.component.html',
  styleUrls: ['product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() public product: Product;
  @Input() public isCart: boolean;
  @Input() public isSearch: boolean;
  @Output() public deleteFromCart: EventEmitter<Product> = new EventEmitter();

  public productCurrency = '$';
  public productCover: string;

  constructor(private store: Store<AppState>,
              private authService: AuthService) {
  }

  public ngOnInit() {
    this.authService.profile.subscribe((user: Profile) => {
      if (!user) {
        return;
      }
      this.productCurrency = user.currency
    });
    this.authService.get();

    this.productCover = this.product.cover;
  }

  public addToCart(product: Product): void {
    this.store.dispatch(new CartActions.AddToCart(this.product));
  }

  public deleteProduct(product: Product): void {
    this.deleteFromCart.emit(product);
  }

  public imgError(): void {
    this.productCover = `../../assets/${this.product.type}.png`;
  }
}
