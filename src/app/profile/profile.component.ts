import { Component, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Currency } from '../shared/currency.model';
import { Auth, HelperService } from '../shared/services/';
import { User } from '../shared/user.model';
import { PromocodeService } from '../shared/services/promocode.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: User;
  public profileCurrency: any;
  public nameCountry: any;
  public promocode: string;
  public persent: number;

  constructor(private auth: Auth,
              private toastr: ToastsManager,
              private helperService: HelperService,
              private promocodeService: PromocodeService) {
  }

  public ngOnInit() {
    this.profileCurrency = Currency.getCurrency();
    this.helperService.getCountry()
      .subscribe((res) => {
        this.nameCountry = res;
      });
    if (!this.auth.user) {
      this.auth.onAuth.subscribe(() => this.user = this.auth.user);
    } else {
      this.user = this.auth.user;
    }
    this.promocodeService.get()
      .subscribe((response) => {
        this.promocode = response.promocode;
        this.persent = response.persent;
      })
  }

  public update(field: string, value: string) {
    this.auth.updateProfile(field, value)
      .subscribe(() => {
          this.toastr.success('Profile update', 'Success');
        },
        (error) => {
          this.toastr.error(error, 'Error');
        });
  }
}
