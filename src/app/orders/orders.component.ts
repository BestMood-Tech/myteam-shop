import { Component, OnInit } from '@angular/core';
import { Auth } from '../shared/services/auth.service';
import { Cart } from '../shared/services/cart.service';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
  styleUrls: ['orders.component.scss'],
})

export class OrdersComponent implements OnInit {
  public orders: any;
  public showOrder: any;
  public checkOutCurrency;

  constructor(private auth: Auth, private cart: Cart) {
  }

  public ngOnInit() {
    if (!this.auth.user) {
      this.auth.onAuth.subscribe(() => {
        this.orders = this.auth.user.orders;
        this.checkOutCurrency = this.auth.user.currency;
      });
    } else {
      this.orders = this.auth.user.orders;
      this.checkOutCurrency = this.auth.user.currency;
    }
  }

  public culcCount(order) {
    let count = 0;
    order.orders.forEach((item) => count += item.count);
    return count;
  }

  public show(order) {
    this.showOrder = order;
  }

  public getInvoice(id) {
    const invoice = this.auth.user.getInvoice(id);
    this.cart.printInvoice(invoice).subscribe(url => {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.click();
    });
  }
}
