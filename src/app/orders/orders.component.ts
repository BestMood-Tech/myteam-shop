import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Order, Profile } from '../shared/models';
import { AuthService, CartService, OrderService } from '../shared/services';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
  styleUrls: ['orders.component.scss'],
})

export class OrdersComponent implements OnInit, OnDestroy {
  public currentOrder: Order;
  public user: Profile;
  public orders: Order[];
  private subscriber: Subscription;

  constructor(private authService: AuthService,
              private cartService: CartService,
              private orderService: OrderService) {
  }

  public ngOnInit() {
    this.subscriber = this.authService.profile
      .subscribe((profile: Profile) => {
        if (!profile) {
          return;
        }
        this.user = profile;
        this.orderService.getByProfile(this.user.id)
          .subscribe((orders) => this.orders = orders);
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
    this.currentOrder = order;
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
