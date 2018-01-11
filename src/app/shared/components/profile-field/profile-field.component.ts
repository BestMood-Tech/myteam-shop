import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-field',
  templateUrl: 'profile-field.component.html',
  styleUrls: ['profile-field.component.scss']
})

export class ProfileFieldComponent implements OnInit {
  @Input() public value: string;
  @Input() public type: string;
  @Input() public selected: any[];
  @Output() public save: EventEmitter<string> = new EventEmitter();
  public edit = false;
  public formValue: FormGroup;

  public ngOnInit() {
    this.formValue = new FormGroup({
      changedValue: new FormControl(this.value, this.type !== 'email' ? Validators.required :
        Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')
      )
    });
  }

  public editItem(): void {
    this.edit = true;
  }

  public saveItem(): void {
    this.edit = false;
    this.save.emit(this.formValue.controls['changedValue'].value);
  }

  public cancelEdit(): void {
    this.edit = false;
  }
}
