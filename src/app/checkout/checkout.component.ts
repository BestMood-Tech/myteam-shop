import { Component, OnInit } from '@angular/core';
import { Cart } from '../shared/services/cart.service';
import { Auth } from '../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../shared/address.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressFormComponent } from '../shared/components/address-form/address-form.component';
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
  public activePromoCode: boolean;
  public arrayAddressUser: any;
  public paymentSystem: string[] = [
    'PayPal', 'CreditCard', 'Cash', 'WebMoney', 'QIWI', 'Bitcoin'
  ];
  public level = 'products';

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
    if (this.auth.user) this.checkOutCurrency = this.auth.user.currency;

    try {
      this.orders = JSON.parse(JSON.stringify(this.cart.getCart()));
      dragscroll.reset();
    } catch (e) {
      this.orders = [];
      dragscroll.reset();
    }

    this.checkOutForm = this.formBulder.group({
      promoCode: 'ANGULAR 2',
      address: [this.checkOutAddress, Validators.required],
      payment: ['', Validators.required]
    });

    this.activePromoCode = true;
    this.arrayAddressUser = this.auth.user.address;
  }

  public getTotal() {
    let price = 0.0;
    this.orders.forEach((item) => {
      price += item.price;
    });
    return price.toFixed(2);
  }

  public checkPromoCode() {
    if (!this.checkOutForm.value.promoCode.length && this.activePromoCode) return;

    let discount = 1;

    switch (this.checkOutForm.value.promoCode) {
      case 'ANGULAR 2':
        discount = 0.75;
        break;
      default:
        discount = 1;
    }

    if (discount === 1) return;

    this.orders.map((item) => item.price *= discount);
    this.activePromoCode = false;
  }

  public onChangeAddress(key) {
    this.checkOutAddress = new Address(this.arrayAddressUser[key]);
  }

  public newAddress() {
    const modalRef = this.modalService.open(AddressFormComponent);
    modalRef.componentInstance.address = new Address({});
    modalRef.result.then(
      (result) => {
        this.checkOutAddress = new Address(result);
        this.checkOutForm.controls['address'].setValue(new Address(result));
      },
      (reason) => null
    );
  }

  public differentAddress() {
    this.checkOutAddress = null;
    this.checkOutForm.controls['address'].reset();
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

  public changeLevel(isNext: boolean) {
    if (isNext) {
      dragscroll.reset();
      if (this.level === 'products') {
        this.level = 'shipping';
        return;
      }
      if (this.level === 'shipping') {
        this.level = 'payment';
        return;
      }
    } else {
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

  public pay() {
    this.toastr.info('Order is processed');
    if (!this.checkPay()) return;
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
