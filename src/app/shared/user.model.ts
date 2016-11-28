import { Address } from './address.model';
export class User {

  nickName: string;
  picture: string;
  provider: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: Address[];
  orders: string [];

  constructor(obj) {
    for(let key of Object.keys(obj)) {
      this[key] = obj[key];
    }
    this.address = [new Address({street: "street", city: "city", zip: "zio"})];
    this.updateLSUser(this.nickName,this.toJson());
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get userProfile():Object {
    return {
      nickName: this.nickName,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      email: this.email
    }
  }

  get userAddress(): Address[] {
    return this.address;
  }

  get userOrders():string[] {
    return this.orders;
  }

  public updateProfile(profile) {
    if (!profile) return;

    for(let key of Object.keys(profile)) {
      this[key] = profile[key];
    }
    this.updateLSUser(this.nickName, this.toJson());
  }

  public updateAddress(address) {
    if (!address) return;
    this.address = address;
    this.updateLSUser(this.nickName, this.toJson());
  }

  public toJson() {
    return JSON.stringify(this);
  }

  public updateLSUser(nick, user) {
    window.localStorage.setItem(nick, user);
  }


}
