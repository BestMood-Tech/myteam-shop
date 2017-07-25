import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Address } from '../shared/address.model';
import { Auth, Cart } from '../shared/services';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public orders: any;
  public checkOutCurrency = '$';
  public checkOutForm: FormGroup;
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
  private user: User;

  constructor(private cart: Cart,
              private auth: Auth,
              private formBulder: FormBuilder,
              private toastr: ToastsManager,
              private router: Router) {
  }

  public ngOnInit() {
    this.auth.onAuth.subscribe((user: User) => {
      this.user = user;
      this.checkOutCurrency = user.currency;
      this.arrayAddressUser = user.address;
    });
    this.auth.getProfile();

    try {
      this.orders = JSON.parse(JSON.stringify(this.cart.getCart()));
    } catch (e) {
      this.orders = [];
    }

    this.orders = this.orders.map(item => {
      item.total = +(item.price * item.count).toFixed(2);
      return item;
    });

    this.activePromoCode = true;
    if (this.arrayAddressUser && this.arrayAddressUser.length) {
      this.checkOutAddress = new Address(this.arrayAddressUser[0]);
      this.checkOutAddressKey = 0;
    }

    this.checkOutForm = this.formBulder.group({
      promoCode: '',
      address: [this.checkOutAddress, Validators.required],
      payment: ['PayPal', Validators.required]
    });
  }

  public getTotal(): number {
    let price = 0.0;
    this.orders.forEach((item) => price += item.total);
    return +price.toFixed(2);
  }

  public checkPromoCode() {
    if (!this.checkOutForm.value.promoCode.length && this.activePromoCode) {
      return;
    }

    let discount = 1;

    switch (this.checkOutForm.value.promoCode) {
      case 'ANGULAR 2':
        discount = 0.75;
        break;
      default:
        discount = 1;
    }

    if (discount === 1) {
      this.checkOutForm.controls['promoCode'].setValue('null');
      return;
    }

    this.orders.map((item) => item.price *= discount);
    this.activePromoCode = false;
  }

  public onChangeAddress(key) {
    // this.arrayAddressUser = this.auth.user.address;
    this.checkOutAddress = new Address(this.arrayAddressUser[key]);
    this.checkOutAddressKey = key;
    this.checkOutForm.controls['address'].setValue(this.checkOutAddress);
  }

  public checkPay(): boolean {
    return this.checkOutForm.valid && this.checkOutAddress != null;
  }

  public saveOrders() {
    const total = this.getTotal();
    const tax = +(total * 0.13).toFixed(2);
    const grandTotal = +(total + tax).toFixed(2);
    if (!this.checkOutForm.controls['promoCode'].value) {
      this.checkOutForm.controls['promoCode'].setValue('null');
    }
    const order = {
      orders: this.orders,
      total,
      tax,
      currency: this.checkOutCurrency,
      grandTotal,
      formProfile: this.checkOutForm.value,
      addressOrder: this.checkOutAddress,
      date: new Date().toISOString()
    };
    this.user.addOrders(order);
    this.auth.updateProfile('orders', this.user.orders)
      .subscribe(
        (data) => this.toastr.success('Orders added to profile', 'Success'));
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
    this.checkOutForm.controls['payment'].setValue(method);
  }

  public pay() {
    this.toastr.info('Order is processed');
    if (!this.checkPay()) {
      return;
    }
    this.isRequesting = true;

    setTimeout(() => {
      this.myPay();
    }, 5000);
  }

  private myPay = function () {
    this.cart.clearCart();
    this.isRequesting = false;
    this.saveOrders();
    this.router.navigate(['./confirmation']);
  };

}
