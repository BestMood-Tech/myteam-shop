import { Component, OnInit } from '@angular/core';
import { Auth } from '../shared/services/auth.service';
import { Address } from '../shared/address.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Cart } from '../shared/services/cart.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {

  public order: any;
  public addressOrder: any;
  public orderDate: Date = new Date();
  public orderUser: string;
  public loading = false;

  constructor(private auth: Auth,
              private cart: Cart,
              private toastr: ToastsManager) {
  }

  public ngOnInit() {
    if (!this.auth.user) {
      this.auth.onAuth.subscribe(() => {
        this.init();
      });
    } else {
      this.init();
    }
  }

  public init() {
    this.orderUser = this.auth.user.lastName + ' ' + this.auth.user.firstName;
    this.order = this.auth.user.orders[this.auth.user.orders.length - 1];
    this.addressOrder = new Address(this.order.addressOrder);
    this.orderDate.setDate(new Date(this.order.date).getDate() + 14);
    this.toastr.success('Your order has been successfully processed', 'Success!');
  }

  public getDate() {
    return `${this.orderDate.getDate()}/${this.orderDate.getMonth()}/${this.orderDate.getFullYear()}`;
  }

  public getInvoice() {
    this.loading = true;
    const invoice = this.auth.user.getInvoice(this.auth.user.orders[this.auth.user.orders.length - 1].id);
    this.cart.printInvoice(invoice).subscribe(url => {
      this.loading = false;
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.click();
    });
  }
}
