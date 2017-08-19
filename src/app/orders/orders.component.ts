import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService, Cart } from '../shared/services';
import { Profile } from '../shared/models/profile.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
  styleUrls: ['orders.component.scss'],
})

export class OrdersComponent implements OnInit, OnDestroy {
  public showOrder: any;
  public user: Profile;
  public orders;
  private subscriber: Subscription;

  constructor(private auth: AuthService,
              private cart: Cart) {
  }

  public ngOnInit() {
    this.subscriber = this.auth.profile.subscribe((user) => {
      if (!user) { return; }
      if (!this.user) {
<<<<<<< HEAD
        console.log(user);
        /*this.auth.getOrdersByProfile(user.id)
          .subscribe((orders) => this.orders = orders);*/
=======
        this.auth.getOrdersByProfile(user.id)
          .subscribe((orders) => this.orders = orders);
>>>>>>> eb130be572bd649ddc7916375eeaf715e2c56b4b
      }
      this.user = user;
    });
    this.auth.getProfile();
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
    this.cart.printInvoice(order.id).subscribe(url => {
      setTimeout(() => {
        newWindow.location.href = url;
        newWindow.focus();
      }, 3000);
    });
  }
}
