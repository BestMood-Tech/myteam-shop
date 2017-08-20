import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService, CartService } from '../shared/services';
import { Profile } from '../shared/models/profile.model';
import { Subscription } from 'rxjs/Subscription';
import { Order } from '../shared/models/order.model';
import { OrderService } from '../shared/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
  styleUrls: ['orders.component.scss'],
})

export class OrdersComponent implements OnInit, OnDestroy {
  public showOrder: any;
  public user: Profile;
  public orders: Order[];
  private subscriber: Subscription;

  constructor(private authService: AuthService,
              private cartService: CartService,
              private orderService: OrderService) {
  }

  public ngOnInit() {
    this.subscriber = this.authService.profile.subscribe((user) => {
      if (!user) { return; }
      if (!this.user) {
        console.log(user);
        this.orderService.getByProfile(user.id)
          .subscribe((orders) => this.orders = orders);
      }
      this.user = user;
    });
    this.authService.get();
  }

  public ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  public calcCount(order) {
    let count = 0;
    order.products.forEach((item) => count += item.count);
    return count;
  }

  public show(order) {
    this.showOrder = order;
  }

  public getInvoice(order) {
    const newWindow = window.open('', '_blank');
    this.cartService.printInvoice(order.id).subscribe(url => {
      setTimeout(() => {
        newWindow.location.href = url;
        newWindow.focus();
      }, 3000);
    });
  }
}
