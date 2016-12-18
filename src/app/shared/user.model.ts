import { Address } from './address.model';
import { Currency } from './currency.model';

export class User {

  nickName: string;
  picture: string;
  provider: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: Address[];
  orders = [];
  currency: string = Currency.getCurrency().dollar[1];

  constructor(obj) {
    for (let key of Object.keys(obj)) {
      if (key !== 'address') {
        this[key] = obj[key];
      } else {
        this[key] = obj[key].map(value => new Address(value));
      }
    }

    if (this.address == null) this.address = [];

    this.updateLSUser(this.nickName, this.toJson());
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get userProfile(): Object {
    return {
      nickName: this.nickName,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      email: this.email,
      currency: this.currency
    };
  }

  get userAddress(): Address[] {
    return this.address;
  }

  get userOrders(): string[] {
    return this.orders;
  }

  public updateProfile(profile) {
    if (!profile) return;

    for (let key of Object.keys(profile)) {
      this[key] = profile[key];
    }
    this.updateLSUser(this.nickName, this.toJson());
  }

  public updateAddress(key, address) {
    if (!address) return;
    this.address[key] = address;
    this.updateLSUser(this.nickName, this.toJson());
  }

  public addAddress(address: Address) {
    if (!address) return;
    this.address.push(address);
    this.updateLSUser(this.nickName, this.toJson());
  }

  public addOrders(item) {
    this.orders.push(item);
    this.updateAddress(this.nickName, this.toJson());
  }

  public deleteAddress(key) {
    this.address.splice(key, 1);
    this.updateLSUser(this.nickName, this.toJson());
  }

  public toJson() {
    return JSON.stringify(this);
  }

  public updateLSUser(nick, user) {
    window.localStorage.setItem(nick, user);
  }


}
