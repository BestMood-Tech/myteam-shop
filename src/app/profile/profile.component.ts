import { Component, OnInit } from '@angular/core';
import { Auth } from '../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profileForm: FormGroup;
  private user: User;

  constructor(private auth: Auth, private formBuilder: FormBuilder) {
    this.user = new User(this.auth.user.userProfile);
  }

  ngOnInit() {
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
      phone: [
        this.user.phone,
        [
          Validators.required
        ]
      ]
    });
  }

  public update() {
    this.auth.user.updateProfile(this.profileForm.value);
  }

}
