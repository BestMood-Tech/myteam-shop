import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';
import { Order, Profile } from '../shared/models';
import { AuthService, CartService, OrderService, PromocodeService } from '../shared/services';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit, OnDestroy {

  public order: Order;
  public orderUser: string;
  public orderId: string;
  public loading = false;
  private user: Profile;
  private subscriber: Subscription;

  constructor(private authService: AuthService,
              private cartService: CartService,
              private toastsManager: ToastsManager,
              private promocodeService: PromocodeService,
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
            this.promocodeService.create(this.user.id, false, this.orderService.count)
              .subscribe((response) => {
                this.toastsManager.info(`You have a promocode with ${response.percent}% discount!`,
                  `New promocode in your profile!`);
              })
          } else {
            if (this.order.promocode) {
              this.promocodeService.remove(this.user.id).subscribe();
            }
          }
        });
    });
    this.authService.get();
  }

  public ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  public getDate() {
    return `${this.order.createdAt.getDate()}/${this.order.createdAt.getMonth()}/${this.order.createdAt.getFullYear()}`;
  }

  public getInvoice() {
    const newWindow = window.open('', '_blank');
    this.loading = true;
    this.cartService.printInvoice(this.orderId).subscribe(url => {
      setTimeout(() => {
        this.loading = false;
        newWindow.location.href = url;
        newWindow.focus();
      }, 3000);
    });
  }
}
