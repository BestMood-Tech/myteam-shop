import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core/src/metadata/directives';
import { HelperService } from '../../services/helper.service';
import { Address } from '../../address.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
  @Input() address;

  public nameCountry:any;
  public addressForm: FormGroup;
  public copyAddress: Address;

  constructor(public activeModal: NgbActiveModal,
              private helper: HelperService,
              private formBulder: FormBuilder) {}

  ngOnInit() {
    this.copyAddress = new Address(this.address);

    this.helper.getCountry().subscribe(res => {
      this.nameCountry = res;
    });

    this.addressForm = this.formBulder.group({
      streetAddress: [this.copyAddress.streetAddress, Validators.required],
      addressLine2: [this.copyAddress.addressLine2, Validators.required],
      city: [this.copyAddress.city, Validators.required],
      state: [this.copyAddress.state, Validators.required],
      zip: [this.copyAddress.zip, Validators.required],
      country: [this.copyAddress.country, Validators.required],
    });

  }

}
