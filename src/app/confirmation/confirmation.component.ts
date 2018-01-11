import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { Order, Profile } from '../shared/models';
import { AuthService, OrderService, Percent } from '../shared/services';
import { AppState } from '../store/app.state';
import { getInvoice } from '../store/cart/cart.state';
import * as CartActions from '../store/cart/cart.action';
import * as PromocodeActions from '../store/promocode/promocode.action';
import { getPromocodePercent } from '../store/promocode/promocode.state';

@Component({
  selector: 'app-confirmation',
  templateUrl: 'confirmation.component.html',
  styleUrls: ['confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit, OnDestroy {

  public order: Order;
  public orderUser: string;
  public orderId: string;
  public loading = false;
  private user: Profile;
  private subscriber: Subscription;

  constructor(private authService: AuthService,
              private store: Store<AppState>,
              private toastsManager: ToastsManager,
              private activatedRoute: ActivatedRoute,
              private orderService: OrderService) {
  }

  public ngOnInit() {
    this.subscriber = this.authService.profile.subscribe((user: Profile) => {
      if (!user || this.user) {
        return;
      }
      this.user = user;
      this.orderUser = user.lastName + ' ' + user.firstName;
      this.activatedRoute.params
        .mergeMap((params) => {
          this.orderId = params.id;
          return this.orderService.getById(this.orderId);
        })
        .subscribe((order: Order) => {
          this.order = order;
          this.toastsManager.success('Your order has been successfully processed', 'Success!');
          if (this.orderService.count / 5 && !(this.orderService.count % 5)) {
            this.store.dispatch(new PromocodeActions.CreatePromocode(this.user.id, false, this.orderService.count))
          } else {
            if (this.order.promocode) {
              this.store.dispatch(new PromocodeActions.RemovePromocode(this.user.id));
            }
          }
        });
    });
    this.authService.get();

    this.store.select(getInvoice)
      .subscribe((url: string) => {
        if (!url) {
          return;
        }
        setTimeout(() => {
          const newWindow = window.open('', '_blank');
          newWindow.location.href = url;
          newWindow.focus();
          this.loading = false;
        }, 1000);
      });
    this.store.select(getPromocodePercent).select((percent: Percent) => {
      if (percent) {
        this.toastsManager.info(`You have a promocode with ${percent.percent}% discount!`,
          `New promocode in your profile!`);
      }
    });
  }

  public ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  public getDate() {
    return `${this.order.createdAt.getDate()}/${this.order.createdAt.getMonth()}/${this.order.createdAt.getFullYear()}`;
  }

  public getInvoice() {
    this.loading = true;
    this.store.dispatch(new CartActions.GetInvoice(this.orderId));
  }
}
