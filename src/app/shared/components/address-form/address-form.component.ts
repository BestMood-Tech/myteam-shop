import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

import { Address } from '../../models';
import { Country, HelperService } from '../../services';

@Component({
  selector: 'app-address-form',
  templateUrl: 'address-form.component.html',
  styleUrls: ['address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
  @Input() public address: Address;
  public countries: Country[];
  public addressForm: FormGroup;
  public copyAddress: Address;

  constructor(public activeModal: NgbActiveModal,
              private helper: HelperService,
              private formBuilder: FormBuilder) {
  }

  public ngOnInit() {
    this.copyAddress = new Address(this.address);

    this.helper.getCountries().subscribe((countries: Country[]) => {
      this.countries = countries;
    });

    this.addressForm = this.formBuilder.group({
      streetAddress: [this.copyAddress.streetAddress, Validators.required],
      addressLine2: [this.copyAddress.addressLine2, Validators.required],
      city: [this.copyAddress.city, Validators.required],
      state: [this.copyAddress.state, Validators.required],
      zip: [this.copyAddress.zip, Validators.required],
      country: [this.copyAddress.country, Validators.required],
    });
  }

  public save(): void {
    if (!this.addressForm.valid) {
      return;
    }
    this.activeModal.close(this.addressForm.value);
  }

}
