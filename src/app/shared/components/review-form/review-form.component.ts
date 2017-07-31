import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../../services/auth.service';
import { siteKeyGC } from '../../helper';
import { User } from '../../user.model';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss']
})

export class ReviewFormComponent implements OnInit {
  public reviewForm: FormGroup;
  public isCaptcha: boolean;
  public siteKey = siteKeyGC;
  public isAuth = false;
  constructor (public activeModal: NgbActiveModal,
               public auth: Auth,
               private formBulder: FormBuilder) {
  }

  public ngOnInit() {
    this.reviewForm = this.formBulder.group({
      text: ['', Validators.required],
      rate: [5, Validators.required]
    });
    this.auth.onAuth.subscribe((user: User) => {
      if (!user) {
        this.isAuth = false;
        return;
      }
      this.isAuth = true;
    });
    this.auth.getProfile();
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
