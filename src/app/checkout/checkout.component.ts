import { Component, OnInit } from '@angular/core';
import { Cart } from '../shared/services/cart.service';
import { Auth } from '../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../shared/address.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressFormComponent } from '../shared/components/address-form/address-form.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public orders: any;
  public checkOutCurrency = "$";
  public checkOutForm: FormGroup;
  public checkOutAddress: Address;

  public acitvePromoCode: boolean;
  public arrayAddressUser: any;

  constructor(private cart: Cart,
              private auth: Auth,
              private formBulder: FormBuilder,
              private modalService: NgbModal) {}

  ngOnInit() {
    if(this.auth.user) this.checkOutCurrency = this.auth.user.currency;

    try {
      this.orders = JSON.parse(JSON.stringify(this.cart.getCart()));
    }
    catch (e) {
      console.log(e);
      this.orders = [];
    }

    this.checkOutForm = this.formBulder.group({
      promoCode: "",
      address: [ this.checkOutAddress , Validators.required ]
    });

    this.acitvePromoCode = true;
    this.arrayAddressUser = this.auth.user.address;
  }

  getTotal() {
    let price = 0.0;
    this.orders.forEach((item) => {
      price += item.price;
    });
    return price.toFixed(2);
  }

  checkPromoCode() {
    if(!this.checkOutForm.value.promoCode.length && this.acitvePromoCode) return;

    let discount = 1;

    switch (this.checkOutForm.value.promoCode) {
      case "ANGULAR 2": discount = 0.75; break;
      default: discount = 1;
    }

    if(discount == 1) return;

    this.orders.map((item) => item.price *= discount);
    this.acitvePromoCode = false;
  }

  onChangeAddress(key) {
    this.checkOutAddress = new Address(this.arrayAddressUser[key]);
  }

  newAddress() {
    const modalRef = this.modalService.open(AddressFormComponent);
    modalRef.componentInstance.address = new Address({});
    modalRef.result.then(
      (result) => {
        this.checkOutAddress = new Address(result);
      },
      (reason) => null
    );
    console.log(this.checkOutForm.value);
  }

  differentAddress() {
    this.checkOutAddress = null;
    console.log(this.checkOutForm.controls);
  }

}
