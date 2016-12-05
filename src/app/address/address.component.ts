import { Component, OnInit } from '@angular/core';
import { Auth } from '../shared/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressFormComponent } from '../shared/components/address-form/address-form.component';
import { Address } from '../shared/address.model';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  constructor(private auth: Auth, private modalService: NgbModal) {
  }

  ngOnInit() {

  }

  update(key) {
    this.open(key);
  }

  add() {
    this.open();
  }

  delete(key) {
    this.auth.user.deleteAddress(key);
  }


  private open(key?) {

    const modalRef = this.modalService.open(AddressFormComponent);
    if (key == null) modalRef.componentInstance.address = new Address({});
    else modalRef.componentInstance.address = this.auth.user.address[key];
    modalRef.result.then(
      (result) => {
        if (key == null) this.auth.user.addAddress(new Address(result));
        else this.auth.user.updateAddress(key, new Address(result));
      },
      (reason) => null
    );
  }


}
