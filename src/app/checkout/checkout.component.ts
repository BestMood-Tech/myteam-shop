import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Address } from '../shared/address.model';
import { Auth, Cart } from '../shared/services';
import { User } from '../shared/user.model';
import { Subscription } from 'rxjs/Subscription';
import { PromocodeService } from '../shared/services/promocode.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

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
  private promoCode: string;
  private subscriber: Subscription;

  constructor(private cart: Cart,
              private auth: Auth,
              private formBulder: FormBuilder,
              private toastr: ToastsManager,
              private router: Router,
              private promocodeService: PromocodeService) {
  }

  public ngOnInit() {
    this.subscriber = this.auth.onAuth.subscribe((user: User) => {
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

  public ngOnDestroy() {
    this.subscriber.unsubscribe();
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

    this.promocodeService.check(this.user.id, this.checkOutForm.value.promoCode)
      .subscribe(
        (response) => {
          this.orders.forEach((item) => {
            item.price *= ((100 - response.percent) / 100);
            item.total = +(item.price * item.count).toFixed(2);
          });
          this.toastr.success(`You have ${response.percent}% discount`, 'Success!');
          this.activePromoCode = false;
        },
        (error) => {
          this.checkOutForm.controls['promoCode'].reset();
          this.toastr.error(error.json().errorMessage, 'Error');
        }
      );
    }

  public onChangeAddress(key) {
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
      this.checkOutForm.controls['promoCode'].setValue(this.promoCode);
    }
    const order = {
      items: this.orders,
      total,
      tax,
      currency: this.checkOutCurrency,
      grandTotal,
      formProfile: this.checkOutForm.value,
      addressOrder: this.checkOutAddress,
      date: new Date().toISOString(),
      orderedBy: this.user.id
    };
    this.auth.createOrder(order)
      .subscribe((data) => {
        this.user.addOrders(data);
        this.toastr.success('Orders added to profile', 'Success');
        this.router.navigate(['./confirmation', {id: data['id']}]);
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
  };

}
