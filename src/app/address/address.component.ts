import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Address } from '../shared/models/address.model';
import { AddressFormComponent } from '../shared/components/address-form/address-form.component';
import { AuthService } from '../shared/services';
import { Profile } from '../shared/models/profile.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnDestroy {
  @Input() public isCart: boolean;
  @Input() public addressKey: number;
  @Output() public chosenAddress = new EventEmitter<number>();
  public error = false;
  public addresses: any;
  private user: Profile;
  private subscriber: Subscription;

  constructor(public auth: AuthService,
              private modalService: NgbModal,
              private toastr: ToastsManager) {
  }

  public ngOnInit() {
    this.subscriber = this.auth.profile.subscribe((user: Profile) => {
      if (!user) {
        return;
      }
      this.user = user;
      this.addresses = user.address;
    });
    this.auth.get();
  }

  public ngOnDestroy() {
    this.subscriber.unsubscribe()
  }

  public update(key) {
    this.open(key);
  }

  public add() {
    this.open();
  }

  public delete(key) {
    this.user.deleteAddress(key);
    this.auth.update('address', this.user.address)
      .subscribe(
        (data) => this.toastr.success('Address delete', 'Success'),
        (error) => this.toastr.error(error, 'Error')
      );
  }


  private open(key?) {
    if (this.user.address.length === 7) {
      this.error = true;
      return;
    }
    this.error = false;
    const modalRef = this.modalService.open(AddressFormComponent, {windowClass: 'modal-add-address'});
    if (key == null) {
      modalRef.componentInstance.address = new Address({});
    } else {
      modalRef.componentInstance.address = this.user.address[key];
    }
    modalRef.result.then(
      (result) => {
        if (key === undefined) {
          this.user.addAddress(new Address(result));
          this.chooseAddress(this.user.address.length - 1);
        } else {
          this.user.updateAddress(key, new Address(result));
        }
        this.auth.update('address', this.user.address)
          .subscribe(
            (data) => this.toastr.success('Address update to profile', 'Success'),
            (error) => {
              console.log('error=', error);
              this.toastr.error(error, 'Error');
            }
          );
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
