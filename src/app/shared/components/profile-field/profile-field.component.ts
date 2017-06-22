import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'profile-field',
  templateUrl: 'profile-field.component.html',
  styleUrls: ['profile-field.component.scss']
})

export class ProfileFieldComponent implements OnInit {
  @Input() public value: string;
  @Output() public save = new EventEmitter<string>();
  public edit = false;
  public formValue: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  public ngOnInit() {
    this.formValue = this.fb.group({
      changedValue: [this.value, Validators.required]
    });
  }

  public editItem() {
    this.edit = true;
  }

  public saveItem() {
    this.edit = false;
    this.save.emit(this.formValue.controls['changedValue'].value);
  }
}
