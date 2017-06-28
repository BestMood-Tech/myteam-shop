import { Component, OnInit } from '@angular/core';
import { Auth } from '../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../shared/user.model';
import { Currency } from '../shared/currency.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HelperService } from "../shared/services/helper.service";

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
    this.user = new User(this.auth.user.userProfile);
  }

  public ngOnInit() {
    this.profileCurrency = Currency.getCurrency();
    this.helperService.getCountry().subscribe((res) => {
      this.nameCountry = res;
    });
  }

  public update(field: string, value: string) {
    this.user[field] = value;
    this.auth.user.updateProfile(this.user);
    this.toastr.success('Profile update', 'Success');
  }

  public compareCurrency(cur) {
    return cur === this.user.currency;
  }

}
