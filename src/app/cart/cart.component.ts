import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, Profile } from '../shared/models';
import { AuthService, CartService } from '../shared/services';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public products: Product[];
  public authorization: boolean;
  public cartCurrency: string;

  constructor(private cartService: CartService,
              private authService: AuthService,
              private router: Router) {
    this.products = this.cartService.get();
    this.authorization = this.authService.isAuthenticated;
  }

  public ngOnInit() {
    this.authService.profile
      .subscribe((profile: Profile) => this.cartCurrency = profile ? profile.currency : '$');
    this.authService.get();
  }


  public deleteProduct(product) {
    this.cartService.remove(product);
    this.products = this.cartService.get();
  }

  public getTotalPrice() {
    let price = 0.0;
    this.products.forEach((item) => {
      price += item.price * item.count;
    });
    return price.toFixed(2);
  }

  public disabledPay(): boolean {
    return !!this.cartService.count && this.authorization;
  }

  public checkout() {
    if (!this.disabledPay()) {
      return;
    }
    this.router.navigate(['./checkout']);
  }

}
