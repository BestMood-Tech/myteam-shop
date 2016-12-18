import { Component, OnInit } from '@angular/core';
import { Auth } from '../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../shared/user.model';
import { Currency } from '../shared/currency.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profileForm: FormGroup;
  private user: User;
  public profileCurrency: any;

  constructor(private auth: Auth, private formBuilder: FormBuilder, private toastr: ToastsManager) {
    this.user = new User(this.auth.user.userProfile);
  }

  ngOnInit() {
    this.profileCurrency = Currency.getCurrencyArray();

    this.profileForm = this.formBuilder.group({
      nickName: [this.user.nickName],
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      email: [
        this.user.email,
        [
          Validators.required,
          Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')
        ]
      ],
      phone: [this.user.phone, Validators.required],
      currency: [this.user.currency, Validators.required]
    });

  }

  public update() {
    this.auth.user.updateProfile(this.profileForm.value);
    this.toastr.success('Profile update', 'Success');
  }

  public compareCurrency(cur) {
    return cur === this.user.currency;
  }

}
