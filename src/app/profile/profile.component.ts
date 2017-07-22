import { Component, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Currency } from '../shared/currency.model';
import { Auth, HelperService } from '../shared/services/';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: User;
  public profileCurrency: any;
  public nameCountry: any;

  constructor(private auth: Auth,
              private toastr: ToastsManager,
              private helperService: HelperService) {
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
