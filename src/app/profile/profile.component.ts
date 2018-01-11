import { Component, OnDestroy, OnInit } from '@angular/core';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { Currency } from '../shared/helper';
import { AuthService, HelperService } from '../shared/services/';
import { Profile, Promocode } from '../shared/models';
import { Country } from '../shared/services';
import { AppState } from '../store/app.state';
import { getPromocode } from '../store/promocode/promocode.state';
import * as PromocodeActions from '../store/promocode/promocode.action';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public user: Profile;
  public profileCurrency: any[];
  public countries: Country[];
  private subscriber: Subscription;
  public promocode: string;
  public percent: number;

  constructor(private authService: AuthService,
              private toastsManager: ToastsManager,
              private helperService: HelperService,
              private store: Store<AppState>) {
  }

  public ngOnInit() {
    this.profileCurrency = Currency.getCurrency();
    this.store.select(getPromocode).subscribe((promocode: Promocode) => {
      if (!promocode) {
        return;
      }
      this.promocode = promocode.promocode;
      this.percent = promocode.percent;
    });
    this.helperService.getCountries()
      .subscribe((countries: Country[]) => {
        this.countries = countries;
      });
    this.subscriber = this.authService.profile.subscribe((user) => {
      if (!user) {
        return;
      }
      if (!this.user) {
        this.store.dispatch(new PromocodeActions.GetPromocode(user.id));
      }
      this.user = user;
    });
    this.authService.get();
  }

  public ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  public update(field: string, value: string): void {
    this.authService.update(field, value)
      .subscribe(
        () => this.toastsManager.success('Profile update', 'Success!'),
        (error) => this.toastsManager.error(error, 'Error!')
      );
  }
}
