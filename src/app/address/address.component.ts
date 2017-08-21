import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';
import { AddressFormComponent } from '../shared/components/address-form/address-form.component';
import { Address, Profile } from '../shared/models';
import { AuthService } from '../shared/services';

const maxNumberOfAddresses = 7;

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
  public addresses: Address[];
  private user: Profile;
  private subscriber: Subscription;

  constructor(public authService: AuthService,
              private modalService: NgbModal,
              private toastsManager: ToastsManager) {
  }

  public ngOnInit() {
    this.subscriber = this.authService.profile.subscribe((user: Profile) => {
      if (!user) {
        return;
      }
      this.user = user;
      this.addresses = user.address;
    });
    this.authService.get();
  }

  public ngOnDestroy() {
    this.subscriber.unsubscribe()
  }

  public delete(key: number) {
    this.user.deleteAddress(key);
    this.authService.update('address', this.user.address)
      .subscribe(
        (data) => this.toastsManager.success('Address delete', 'Success'),
        (error) => this.toastsManager.error(error, 'Error')
      );
  }

  private openModalWindow(key?: number) {
    if (this.user.address.length === maxNumberOfAddresses && key === undefined) {
      this.error = true;
      return;
    }
    this.error = false;
    const modalRef = this.modalService.open(AddressFormComponent, { windowClass: 'modal-add-address' });
    if (key === null) {
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
        this.authService.update('address', this.user.address)
          .subscribe(
            (data) => this.toastsManager.success('Address update to profile', 'Success'),
            (error) => {
              this.toastsManager.error(error, 'Error');
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
