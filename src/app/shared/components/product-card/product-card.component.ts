import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Profile } from '../../models';
import { AuthService, CartService } from '../../services/';
import { Product } from '../../models/product.model';

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

  constructor(private cart: CartService, private authService: AuthService) {
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
    this.cart.add(product);
  }

  public deleteProduct(product: Product): void {
    this.deleteFromCart.emit(product);
  }

  public imgError(): void {
    this.productCover = `../../assets/${this.product.type}.png`;
  }
}
