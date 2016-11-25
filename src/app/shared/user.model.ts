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

  get Phone(): string {
    return `${this.phone}`;
  }

  get Email(): string {
    return `${this.email}`;
  }

  get Address(): string[] {
    return this.address;
  }


}
