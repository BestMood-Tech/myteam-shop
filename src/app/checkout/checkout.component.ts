import { Component, OnInit } from '@angular/core';
import { Cart } from '../shared/services/cart.service';
import { Auth } from '../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../shared/address.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import dragscroll from 'dragscroll';

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

  constructor(private cart: Cart,
              private auth: Auth,
              private formBulder: FormBuilder,
              private modalService: NgbModal,
              private toastr: ToastsManager,
              private router: Router) {
    dragscroll.reset();
  }

  public ngOnInit() {
    if (this.auth.user) {
      this.checkOutCurrency = this.auth.user.currency;
    }

    try {
      this.orders = JSON.parse(JSON.stringify(this.cart.getCart()));
      dragscroll.reset();
    } catch (e) {
      this.orders = [];
      dragscroll.reset();
    }

    this.activePromoCode = true;
    this.arrayAddressUser = this.auth.user.address;
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

  public getTotal() {
    let price = 0.0;
    this.orders.forEach((item) => {
      price += item.price * item.count;
    });
    return price.toFixed(2);
  }

  public checkPromoCode() {
    if (!this.checkOutForm.value.promoCode.length && this.activePromoCode) { return; }

    let discount = 1;

    switch (this.checkOutForm.value.promoCode) {
      case 'ANGULAR 2':
        discount = 0.75;
        break;
      default:
        discount = 1;
    }

    if (discount === 1) { return; }

    this.orders.map((item) => item.price *= discount);
    this.activePromoCode = false;
  }

  public onChangeAddress(key) {
    this.arrayAddressUser = this.auth.user.address;
    this.checkOutAddress = new Address(this.arrayAddressUser[key]);
    this.checkOutAddressKey = key;
    this.checkOutForm.controls['address'].setValue(this.checkOutAddress);
  }

  public checkPay(): boolean {
    return this.checkOutForm.valid && this.checkOutAddress != null;
  }

  public saveOrders() {
    this.auth.user.addOrders({
      orders: this.orders,
      total: this.getTotal(),
      formProfile: this.checkOutForm.value,
      addressOrder: this.checkOutAddress,
      data: new Date()
    });
    this.toastr.success('Orders added to profile', 'Success');
  }

  public changeLevel(isNext: boolean, level?: string) {
    if (level) {
      if (level === this.level) { return; }
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
      dragscroll.reset();
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
      dragscroll.reset();
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
    if (!this.checkPay()) { return; }
    this.isRequesting = true;

    setTimeout(() => {
      this.myPay();
    }, 5000);
  }

  private myPay = function() {
    this.cart.clearCart();
    this.isRequesting = false;
    this.saveOrders();
    this.router.navigate(['./confirmation']);
  };

}
