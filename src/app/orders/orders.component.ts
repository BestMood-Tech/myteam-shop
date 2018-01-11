import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { Order, Profile } from '../shared/models';
import { AuthService, OrderService } from '../shared/services';
import { AppState } from '../store/app.state';
import { getInvoice } from '../store/cart/cart.state';
import * as CartActions from '../store/cart/cart.action';

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
              private store: Store<AppState>,
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

    this.store.select(getInvoice)
      .subscribe((url: string) => {
        setTimeout(() => {
          const newWindow = window.open('', '_blank');
          newWindow.location.href = url;
          newWindow.focus();
        }, 1000);
      });
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
    this.store.dispatch(new CartActions.GetInvoice(order.id));
  }
}
