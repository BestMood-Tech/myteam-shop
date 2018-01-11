import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { Address, Order, Product, Profile } from '../shared/models';
import { AuthService, OrderService, Percent, PromocodeService } from '../shared/services';
import { AppState } from '../store/app.state';
import { getCart } from '../store/cart/cart.state';
import * as CartActions from '../store/cart/cart.action';
import * as PromocodeActions from '../store/promocode/promocode.action';
import { getPromocodeError, getPromocodePercent } from '../store/promocode/promocode.state';

@Component({
  selector: 'app-checkout',
  templateUrl: 'checkout.component.html',
  styleUrls: ['checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  public products: Product[];
  public checkOutCurrency: string;
  public checkOutAddress: Address;
  public checkOutAddressKey: number;
  public activePromoCode: boolean;
  public arrayAddressUser: Address[];
  public paymentSystem = [
    'PayPal', 'CreditCard', 'Cash', 'WebMoney', 'QIWI', 'Bitcoin'
  ];
  public levels = ['products', 'shipping', 'payments'];
  public step = 0;
  public currentLevel = this.levels[this.step];
  public direction = 'next';

  public isRequesting: boolean;

  public promocode: string;
  public payment = 'PayPal';
  private user: Profile;
  private subscriber: Subscription;

  constructor(private store: Store<AppState>,
              private authService: AuthService,
              private toastsManager: ToastsManager,
              private router: Router,
              private promocodeService: PromocodeService,
              private orderService: OrderService) {
  }

  public ngOnInit() {
    this.subscriber = this.authService.profile
      .subscribe((profile: Profile) => {
        if (!profile) {
          return
        }
        this.user = profile;
        this.checkOutCurrency = profile.currency;
        this.arrayAddressUser = profile.address;
        this.store.select(getCart)
          .subscribe((products: Product[]) => {
            this.products = products;
            this.products.map(item => {
              item.total = +(item.price * item.count).toFixed(2);
              return item;
            });
          });
        this.store.dispatch(new CartActions.GetCart());
        if (this.arrayAddressUser && this.arrayAddressUser.length) {
          this.checkOutAddress = new Address(this.arrayAddressUser[0]);
          this.checkOutAddressKey = 0;
        }
        this.activePromoCode = true;
      });
    this.authService.get();
    this.store.select(getPromocodePercent).subscribe((percent: Percent) => {
      this.products.forEach((item) => {
        item.price *= ((100 - percent.percent) / 100);
        item.total = +(item.price * item.count).toFixed(2);
      });
      this.toastsManager.success(`You have ${percent.percent}% discount`, 'Success!');
      this.activePromoCode = false;
    });
    this.store.select(getPromocodeError).subscribe((error: string) => {
      this.promocode = '';
      console.log(error);
      this.toastsManager.error(error, 'Error');
    });
  }

  public ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  public getTotal() {
    let price = 0.0;
    this.products.forEach((item) => price += item.total);
    return +price.toFixed(2);
  }

  public checkPromoCode() {
    if (!this.promocode || !this.promocode.length && this.activePromoCode) {
      return;
    }
    this.store.dispatch(new PromocodeActions.CheckPromocode(this.user.id, this.promocode));
  }

  public onChangeAddress(key) {
    this.checkOutAddress = new Address(this.arrayAddressUser[key]);
    this.checkOutAddressKey = key;
  }

  public checkPay(): boolean {
    return !!this.checkOutAddress;
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
        this.store.dispatch(new CartActions.ClearCart());
        this.toastsManager.success('Orders added to profile', 'Success');
        this.router.navigate(['./confirmation', data['id']]);
      });
  }

  public setStep(step: number | string) {
    if (typeof step === 'number') {
      this.step = step;
      this.currentLevel = this.levels[this.step];
      return;
    }
    switch (step) {
      case 'next':
        this.step++;
        break;
      case 'prev':
        this.step--;
        break;
      default:
        return;
    }
    this.direction = step;
    this.currentLevel = this.levels[this.step];
  }

  public changePayment(method: string) {
    this.payment = method;
  }

  public pay() {
    this.toastsManager.info('Order is processed');
    if (!this.checkPay()) {
      return;
    }
    this.isRequesting = true;
    this.saveOrders();
  }
}
