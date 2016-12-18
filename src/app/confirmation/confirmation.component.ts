import { Component, OnInit } from '@angular/core';
import { Auth } from '../shared/services/auth.service';
import { Address } from '../shared/address.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  public order: any;
  public addressOrder: any;
  public orderDate: Date = new Date();

  constructor(private auth: Auth, private toastr: ToastsManager) {
  }

  ngOnInit() {
    this.order = this.auth.user.orders[this.auth.user.orders.length - 1];
    this.addressOrder = new Address(this.order.addressOrder);
    this.orderDate.setDate(new Date(this.order.data).getDate() + 14);
    this.toastr.success('Your order has been successfully processed', 'Success!');
  }

  getDate() {
    return `${this.orderDate.getDate()}/${this.orderDate.getMonth()}/${this.orderDate.getFullYear()}`;
  }

}
