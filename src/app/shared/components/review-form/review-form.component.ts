import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../../services/auth.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss']
})

export class ReviewFormComponent implements OnInit {
  public reviewForm: FormGroup;
  public isCaptcha: boolean;
  constructor (public activeModal: NgbActiveModal,
               public auth: Auth,
               private formBulder: FormBuilder) {
  }

  public ngOnInit() {
    this.reviewForm = this.formBulder.group({
      text: ['', Validators.required],
      rate: [1, Validators.required]
    });
    this.isCaptcha = false;
  }

  public save() {
    if (!this.reviewForm.valid) {
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
