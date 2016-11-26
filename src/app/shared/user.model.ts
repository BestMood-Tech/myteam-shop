export class User {

  nickname: string;
  picture: string;
  provider: string;
  email: string;
  firsname: string;
  lastname: string;
  phone: string;
  address: string[];
  orders: string [];

  constructor(obj) {
    [
      this.nickname,
      this.picture,
      this.provider,
      this.email,
      this.firsname,
      this.lastname,
      this.phone,
      this.address,
      this.orders
    ] = obj;
  }

  get fullName(): string {
    return `${this.firsname} ${this.lastname}`;
  }

  get userProfile():User {
    return this;
  }

  get userPhone(): string {
    return `${this.phone}`;
  }

  get userEmail(): string {
    return `${this.email}`;
  }

  get userAddress(): string[] {
    return this.address;
  }

  get userOrders():string[] {
    return this.orders;
  }

  public updateProfile(profile) {
    if (!profile) return;
    this.firsname = profile.firsname;
    this.lastname = profile.lastname;
    this.email = profile.email;
    this.phone = profile.phone;

    this.updateLSUser(this.nickname, this.toJson());
  }

  public updateAddress(address) {
    if (!address) return;
    this.address = address;
    this.updateLSUser(this.nickname, this.toJson());
  }

  public toJson() {
    return JSON.stringify(this);
  }

  public updateLSUser(nick, user) {
    window.localStorage.setItem(nick, user);
  }


}
