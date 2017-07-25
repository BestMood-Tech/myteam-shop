import { Component, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Address } from '../shared/address.model';
import { Auth, Cart } from '../shared/services';
import { User } from '../shared/user.model';

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
  private user: User;

  constructor(private auth: Auth,
              private cart: Cart,
              private toastr: ToastsManager) {
  }

  public ngOnInit() {
    this.auth.onAuth.subscribe((user: User) => {
      this.user = user;
      if (!user) {
        return;
      }
      this.orderUser = user.lastName + ' ' + user.firstName;
      this.order = user.orders[user.orders.length - 1];
      this.addressOrder = new Address(this.order.addressOrder);
      this.orderDate.setDate(new Date(this.order.date).getDate() + 14);
      this.toastr.success('Your order has been successfully processed', 'Success!');
    });
    this.auth.getProfile();
  }

  public getDate() {
    return `${this.orderDate.getDate()}/${this.orderDate.getMonth()}/${this.orderDate.getFullYear()}`;
  }

  public getInvoice() {
    this.loading = true;
    const newWindow = window.open('', '_blank');
    const invoice = this.user.getInvoice(this.user.orders[this.user.orders.length - 1].id);
    this.cart.printInvoice(invoice).subscribe(url => {
      this.loading = false;
      newWindow.location.href = url;
      newWindow.focus();
    });
  }
}
