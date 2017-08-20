import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Address } from '../shared/models/address.model';
import { AuthService, CartService } from '../shared/services';
import { Profile } from '../shared/models/profile.model';
import { Subscription } from 'rxjs/Subscription';
import { PromocodeService } from '../shared/services/promocode.service';
import { Order } from '../shared/models/order.model';
import { Product } from '../shared/models/product.model';
import { OrderService } from '../shared/services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  public products: Product[];
  public checkOutCurrency = '$';
  public checkOutAddress: Address;
  public checkOutAddressKey: number;
  public activePromoCode: boolean;
  public arrayAddressUser: any;
  public paymentSystem: string[] = [
    'PayPal', 'CreditCard', 'Cash', 'WebMoney', 'QIWI', 'Bitcoin'
  ];
  public level = 'products';
  public direction = 'next';

  public isRequesting: boolean;

  public promocode: string;
  public payment = 'PayPal';
  private user: Profile;
  private subscriber: Subscription;

  constructor(private cartService: CartService,
              private authService: AuthService,
              private toastr: ToastsManager,
              private router: Router,
              private promocodeService: PromocodeService,
              private orderService: OrderService) {
  }

  public ngOnInit() {
    this.subscriber = this.authService.profile.subscribe((user: Profile) => {
      this.user = user;
      this.checkOutCurrency = user.currency;
      this.arrayAddressUser = user.address;
    });
    this.authService.get();

    try {
      this.products = JSON.parse(JSON.stringify(this.cartService.get()));
    } catch (e) {
      this.products = [];
    }

    this.products = this.products.map(item => {
      item.total = +(item.price * item.count).toFixed(2);
      return item;
    });

    this.activePromoCode = true;
    if (this.arrayAddressUser && this.arrayAddressUser.length) {
      this.checkOutAddress = new Address(this.arrayAddressUser[0]);
      this.checkOutAddressKey = 0;
    }
  }

  public ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  public getTotal(): number {
    let price = 0.0;
    this.products.forEach((item) => price += item.total);
    return +price.toFixed(2);
  }

  public checkPromoCode() {
    if (!this.promocode.length && this.activePromoCode) {
      return;
    }

    this.promocodeService.check(this.user.id, this.promocode)
      .subscribe(
        (response) => {
          this.products.forEach((item) => {
            item.price *= ((100 - response.percent) / 100);
            item.total = +(item.price * item.count).toFixed(2);
          });
          this.toastr.success(`You have ${response.percent}% discount`, 'Success!');
          this.activePromoCode = false;
        },
        (error) => {
          this.promocode = '';
          this.toastr.error(error.json().errorMessage, 'Error');
        }
      );
    }

  public onChangeAddress(key) {
    this.checkOutAddress = new Address(this.arrayAddressUser[key]);
    this.checkOutAddressKey = key;
  }

  public checkPay(): boolean {
    return this.checkOutAddress != null;
  }

  public saveOrders() {
    const total = this.getTotal();
    const tax = +(total * 0.13).toFixed(2);
    const grandTotal = +(total + tax).toFixed(2);
    const order = new Order({
      products: this.products,
      total,
      tax,
      currency: this.checkOutCurrency,
      grandTotal,
      payment: this.payment,
      promocode: this.promocode,
      addressOrder: this.checkOutAddress
    });
    this.orderService.create(order)
      .subscribe((data) => {
        this.isRequesting = false;
        this.cartService.clear();
        this.toastr.success('Orders added to profile', 'Success');
        this.router.navigate(['./confirmation', data['id']]);
      });
  }

  public changeLevel(isNext: boolean, level?: string) {
    if (level) {
      if (level === this.level) {
        return;
      }
      switch (level) {
        case 'products':
          this.direction = 'prev';
          this.level = level;
          break;
        case 'payment':
          this.direction = 'next';
          this.level = level;
          break;
        case 'shipping':
          if (this.level === 'products') {
            this.direction = 'next';
          } else {
            this.direction = 'prev';
          }
          this.level = level;
          break;
      }
      return;
    }
    if (isNext) {
      this.direction = 'next';
      if (this.level === 'products') {
        this.level = 'shipping';
        return;
      }
      if (this.level === 'shipping') {
        this.level = 'payment';
        return;
      }
    } else {
      this.direction = 'prev';
      if (this.level === 'shipping') {
        this.level = 'products';
        return;
      }
      if (this.level === 'payment') {
        this.level = 'shipping';
        return;
      }
    }
  }

  public changePayment(method: string) {
    this.payment = method;
  }

  public pay() {
    this.toastr.info('Order is processed');
    if (!this.checkPay()) {
      return;
    }
    this.isRequesting = true;
    this.saveOrders();
  }
}
