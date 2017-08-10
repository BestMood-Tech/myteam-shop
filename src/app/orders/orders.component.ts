import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, Cart } from '../shared/services';
import { User } from '../shared/user.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
  styleUrls: ['orders.component.scss'],
})

export class OrdersComponent implements OnInit, OnDestroy {
  public showOrder: any;
  public user: User;
  public orders;
  private subscriber: Subscription;

  constructor(private auth: Auth,
              private cart: Cart) {
  }

  public ngOnInit() {
    this.subscriber = this.auth.onAuth.subscribe((user) => {
      if (!user) { return; }
      if (!this.user) {
        console.log(user);
        this.auth.getOrdersByProfile(user.id)
          .subscribe((orders) => this.orders = orders.Items);
      }
      this.user = user;
    });
    this.auth.getProfile();
  }

  public ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  public culcCount(order) {
    let count = 0;
    order.items.forEach((item) => count += item.count);
    return count;
  }

  public show(order) {
    this.showOrder = order;
  }

  public getInvoice(order) {
    const invoice = this.user.getInvoice(order);
    const newWindow = window.open('', '_blank');
    this.cart.printInvoice(invoice).subscribe(url => {
      newWindow.location.href = url;
      newWindow.focus();
    });
  }
}
