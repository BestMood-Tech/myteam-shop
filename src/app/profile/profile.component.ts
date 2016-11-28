import { Component, OnInit } from '@angular/core';
import { Auth } from '../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profileForm: FormGroup;

  constructor(private auth: Auth, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      nickName: [this.auth.user.nickName],
      firstName: [this.auth.user.firstName, Validators.required],
      lastName: [this.auth.user.lastName, Validators.required],
      email: [
        this.auth.user.email,
        [
          Validators.required,
          Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')
        ]
      ],
      phone: [
        this.auth.user.phone,
        [
          Validators.required
        ]
      ]
    });
  }

  public update() {
    console.log(this.auth.user);
    this.auth.user.updateProfile(this.profileForm.value);
  }

}
