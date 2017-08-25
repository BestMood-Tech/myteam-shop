import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';
import { Address, Order, Product, Profile } from '../shared/models';
import { AuthService, CartService, OrderService, PromocodeService } from '../shared/services';

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

  constructor(private cartService: CartService,
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
        this.products = this.cartService.get().map(item => {
          item.total = +(item.price * item.count).toFixed(2);
          return item;
        });
        if (this.arrayAddressUser && this.arrayAddressUser.length) {
          this.checkOutAddress = new Address(this.arrayAddressUser[0]);
          this.checkOutAddressKey = 0;
        }
        this.activePromoCode = true;
      });
    this.authService.get();
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

    this.promocodeService.check(this.user.id, this.promocode)
      .subscribe(
        (response) => {
          this.products.forEach((item) => {
            item.price *= ((100 - response.percent) / 100);
            item.total = +(item.price * item.count).toFixed(2);
          });
          this.toastsManager.success(`You have ${response.percent}% discount`, 'Success!');
          this.activePromoCode = false;
        },
        (error) => {
          this.promocode = '';
          this.toastsManager.error(error.json().errorMessage, 'Error');
        }
      );
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
        this.cartService.clear();
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
