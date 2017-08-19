import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services';
import { siteKeyGC } from '../shared/helper';
import { Profile } from '../shared/models/profile.model';

@Component({
  selector: 'app-review-form',
  templateUrl: 'review-form.component.html',
  styleUrls: ['review-form.component.scss']
})

export class ReviewFormComponent implements OnInit {
  public reviewForm: FormGroup;
  public isCaptcha: boolean;
  public siteKey = siteKeyGC;
  public isAuth = false;
  constructor (public activeModal: NgbActiveModal,
               public auth: AuthService,
               private formBulder: FormBuilder) {
  }

  public ngOnInit() {
    this.reviewForm = this.formBulder.group({
      text: ['', Validators.required],
      rate: [5, Validators.required]
    });
    this.auth.profile.subscribe((user: Profile) => {
      if (!user) {
        this.isAuth = false;
        return;
      }
      this.isAuth = true;
    });
    this.auth.get();
    this.isCaptcha = false;
  }

  public save() {
    if (!this.reviewForm.valid && this.isCaptcha) {
      return;
    }
    this.activeModal.close(this.reviewForm.value);
  }

  public setRate(value) {
    this.reviewForm.controls.rate.setValue(value);
  }

  public resolved() {
    this.isCaptcha = true;
  }
}
