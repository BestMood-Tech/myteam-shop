import { Address } from './address.model';

export class Profile {
  public id: string;
  public firstName: string;
  public lastName: string;
  public nickName: string;
  public picture: string;
  public country: string;
  public currency: string;
  public email: string;
  public address: Address[];
  public phone: string;
  public mobile: string;

  constructor(obj) {
    for (const key in obj) {
      if (key === 'address') {
        this[key] = obj[key].map(value => new Address(value));
      } else {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].replace(/[\uD800-\uDFFF]./g, '');
        }
        this[key] = obj[key];
      }
    }

    if (!this.address) {
      this.address = [];
    }
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public updateAddress(key, address: Address) {
    if (!address) {
      return;
    }
    this.address[key] = address;
  }

  public addAddress(address: Address) {
    if (!address) {
      return;
    }
    this.address.push(address);
  }

  public deleteAddress(key) {
    this.address.splice(key, 1);
  }
}
