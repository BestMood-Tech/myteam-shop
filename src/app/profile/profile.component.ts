import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Currency } from '../shared/models/currency.model';
import { AuthService, HelperService } from '../shared/services/';
import { Profile } from '../shared/models/profile.model';
import { PromocodeService } from '../shared/services/promocode.service';
import { Subscription } from 'rxjs/Subscription';
import { Country } from '../shared/services/helper.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public user: Profile;
  public profileCurrency: any;
  public countries: Country[];
  private subscriber: Subscription;
  public promocode: string;
  public percent: number;

  constructor(private auth: AuthService,
              private toastr: ToastsManager,
              private helperService: HelperService,
              private promocodeService: PromocodeService) {
  }

  public ngOnInit() {
    this.profileCurrency = Currency.getCurrency();
    this.helperService.getCountries()
      .subscribe((countries: Country[]) => {
        this.countries = countries;
      });
    this.subscriber = this.auth.profile.subscribe((user) => {
      if (!user) { return; }
      if (!this.user) {
        this.promocodeService.get(user.id)
          .subscribe((response) => {
            this.promocode = response.promocode;
            this.percent = response.percent;
          });
      }
      this.user = user;
    });
    this.auth.get();
  }

  public ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  public update(field: string, value: string) {
    this.auth.update(field, value)
      .subscribe(
        (data) => this.toastr.success('Profile update', 'Success'),
        (error) => this.toastr.success(error)
      );
  }
}
