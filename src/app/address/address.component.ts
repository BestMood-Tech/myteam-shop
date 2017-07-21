import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Auth } from '../shared/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { AddressFormComponent } from '../shared/components/address-form/address-form.component';
import { Address } from '../shared/address.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  @Input() public isCart: boolean;
  @Input() public addressKey: number;
  @Output() public chosenAddress = new EventEmitter<number>();
  public error = false;
  public addresses: any;

  constructor(public auth: Auth,
              private modalService: NgbModal,
              private toastr: ToastsManager) {
  }

  public ngOnInit() {
    if (!this.auth.user) {
      this.auth.onAuth.subscribe(() => this.addresses = this.auth.user.address);
    } else {
      this.addresses = this.auth.user.address;
    }
  }

  public update(key) {
    this.open(key);
  }

  public add() {
    this.open();
  }

  public delete(key) {
    this.auth.user.deleteAddress(key);
    this.auth.updateProfile('address', this.auth.user.address)
      .subscribe((data) => {
        this.toastr.success('Address delete', 'Success');
      });
  }


  private open(key?) {
    if (this.auth.user.address.length === 7) {
      this.error = true;
      return;
    }
    this.error = false;
    const modalRef = this.modalService.open(AddressFormComponent, {windowClass: 'modal-add-address'});
    if (key == null) {
      modalRef.componentInstance.address = new Address({});
    } else {
      modalRef.componentInstance.address = this.auth.user.address[key];
    }
    modalRef.result.then(
      (result) => {
        if (!key) {
          this.auth.user.addAddress(new Address(result));
          this.chooseAddress(this.auth.user.address.length - 1);
          this.auth.updateProfile('address', this.auth.user.address)
            .subscribe((data) => {
              this.toastr.success('Address added to profile', 'Success');
            });
        } else {
          this.auth.user.updateAddress(key, new Address(result));
          this.auth.updateProfile('address', this.auth.user.address)
            .subscribe((data) => {
              this.toastr.success('Address update to profile', 'Success');
            });
        }
      },
      (reason) => null
    );
  }

  public chooseAddress(key: number) {
    if (this.isCart) {
      this.chosenAddress.emit(key);
      this.addressKey = key;
    }
  }

}
