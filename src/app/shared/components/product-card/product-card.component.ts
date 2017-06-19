import { Component, Input, OnInit } from '@angular/core';
import { Cart } from '../../services/cart.service';
import { Auth } from '../../services/auth.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() public product;
  @Input() public label;

  public productCurrency: any;

  constructor(private cart: Cart, private auth: Auth) {}

  public ngOnInit() {
    if (this.auth.user == null) {
      this.productCurrency = '$';
    } else {
      this.productCurrency = this.auth.user.currency;
    }
  }

  public addToCart(product) {
    this.cart.addToCart(product);
  }

  public getLabel() {
    switch (this.product.type) {
      case 'game': return 'label-danger';
      case 'book': return 'label-info';
      case 'movie': return 'label-warning';
      default: return 'label-succes';
    }
  }
}
