import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-field',
  templateUrl: 'profile-field.component.html',
  styleUrls: ['profile-field.component.scss']
})

export class ProfileFieldComponent implements OnInit {
  @Input() public value: string;
  @Input() public type: string;
  @Input() public selected: any[];
  @Output() public save = new EventEmitter<string>();
  public edit = false;
  public formValue: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  public ngOnInit() {
    this.formValue = this.fb.group({
      changedValue: [this.value, this.type !== 'email' ? Validators.required :
        Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')
      ]
    });

  }

  public editItem() {
    this.edit = true;
  }

  public saveItem() {
    this.edit = false;
    this.save.emit(this.formValue.controls['changedValue'].value);
  }

  public cancelEdit() {
    this.edit = false;
  }
}
