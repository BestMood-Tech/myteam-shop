import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Address } from '../shared/models/address.model';
import { AuthService, CartService } from '../shared/services';
import { Profile } from '../shared/models/profile.model';
import { Subscription } from 'rxjs/Subscription';
import { PromocodeService } from '../shared/services/promocode.service';
import { OrderService } from '../shared/services/order.service';
import { Order } from '../shared/models/order.model';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit, OnDestroy {

  public order: Order;
  public orderUser: string;
  public orderId;
  public loading = false;
  private user: Profile;
  private subscriber: Subscription;


  constructor(private authService: AuthService,
              private cartService: CartService,
              private toastr: ToastsManager,
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
        .subscribe((params) => {
          this.orderId = params.id;
          this.orderService.getById(this.orderId).subscribe((order: Order) => {
            this.order = order;
            this.toastr.success('Your order has been successfully processed', 'Success!');
            if (this.orderService.count / 5 && !(this.orderService.count % 5)) {
              this.promocodeService.create(this.user.id, false, this.orderService.count)
                .subscribe((response) => {
                  this.toastr.info(`You have a promocode with ${response.percent}% discount!`,
                    `New promocode in your profile!`);
                })
            } else {
              if (this.order.promocode) {
                this.promocodeService.remove(this.user.id).subscribe();
              }
            }
          });
        })
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
