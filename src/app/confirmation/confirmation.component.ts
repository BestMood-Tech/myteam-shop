import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Address } from '../shared/address.model';
import { Auth, Cart } from '../shared/services';
import { User } from '../shared/user.model';
import { Subscription } from 'rxjs/Subscription';
import { PromocodeService } from '../shared/services/promocode.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit, OnDestroy {

  public order: any;
  public addressOrder: any;
  public orderDate: Date = new Date();
  public orderUser: string;
  public orderId;
  public loading = false;
  private user: User;
  private subscriber: Subscription;

  constructor(private auth: Auth,
              private cart: Cart,
              private toastr: ToastsManager,
              private promocodeService: PromocodeService,
              private activatedRoute: ActivatedRoute) {
  }

  public ngOnInit() {
    this.subscriber = this.auth.onAuth.subscribe((user: User) => {
      if (!user || this.user) {
        return;
      }
      this.user = user;
      this.orderUser = user.lastName + ' ' + user.firstName;
      this.activatedRoute.paramMap
        .mergeMap((params) => this.auth.getOrderById(params.get('id')))
        .subscribe((orders) => {
          this.order = orders;
          this.addressOrder = new Address(this.order.addressOrder);
          this.orderDate.setDate(new Date(this.order.date).getDate() + 14);
          this.toastr.success('Your order has been successfully processed', 'Success!');
          if (this.auth.getOrderCount() / 5 && !(this.auth.getOrderCount() % 5)) {
            this.promocodeService.create(this.user.id, false, this.auth.getOrderCount())
              .subscribe((response) => {
                this.toastr.info(`You have a promocode with ${response.persent}% discount!`,
                  `New promocode in your profile!`);
              })
          } else {
            if (this.order.formProfile.promoCode) {
              this.promocodeService.remove(this.user.id).subscribe();
            }
          }
        });
    });
    this.auth.getProfile();
  }

  public ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  public getDate() {
    return `${this.orderDate.getDate()}/${this.orderDate.getMonth()}/${this.orderDate.getFullYear()}`;
  }

  public getInvoice() {
    this.loading = true;
    const newWindow = window.open('', '_blank');
    const invoice = this.user.getInvoice(this.order);
    this.cart.printInvoice(invoice).subscribe(url => {
      this.loading = false;
      newWindow.location.href = url;
      newWindow.focus();
    });
  }
}
