import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { siteKeyGC } from '../../../shared/helper';
import { Profile } from '../../../shared/models';
import { AuthService } from '../../../shared/services';

@Component({
  selector: 'app-review-form',
  templateUrl: 'review-form.component.html',
  styleUrls: ['review-form.component.scss']
})

export class ReviewFormComponent implements OnInit {
  public reviewForm: FormGroup;
  public isCaptcha = false;
  public siteKey = siteKeyGC;
  public isAuth = false;

  constructor(public activeModal: NgbActiveModal,
              public authService: AuthService) {
  }

  public ngOnInit() {
    this.reviewForm = new FormGroup({
      text: new FormControl('', Validators.required),
      rate: new FormControl(5, Validators.required)
    });
    this.authService.profile.subscribe((user: Profile) => {
      this.isAuth = !!user;
    });
    this.authService.get();
  }

  public save(): void {
    if (!this.reviewForm.valid && !this.isCaptcha) {
      return;
    }
    this.activeModal.close(this.reviewForm.value);
  }

  public setRate(value: number): void {
    this.reviewForm.controls.rate.setValue(value);
  }

  public resolved(): void {
    this.isCaptcha = true;
  }
}
