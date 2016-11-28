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
    [
      this.nickName,
      this.picture,
      this.provider,
      this.email,
      this.firstName,
      this.lastName,
      this.phone,
      this.orders
    ] = obj;
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
    this.firstName = profile.firstName;
    this.lastName = profile.lastName;
    this.email = profile.email;
    this.phone = profile.phone;

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
