import { Component, OnInit } from '@angular/core';
import { Auth } from '../shared/services/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
  styleUrls: ['orders.component.scss']
})

export class OrdersComponent implements OnInit {
  public orders: any;
  public showOrder: any;
  public checkOutCurrency;

  constructor(private auth: Auth) {
  }

  public ngOnInit() {
    this.orders = this.auth.user.orders;
    this.checkOutCurrency = this.auth.user.currency;
    console.log(this.orders);
  }

  public culcCount(order) {
    let count = 0;
    order.orders.forEach((item) => count += item.count);
    return count;
  }

  public show(order) {
    this.showOrder = order;
  }
}
