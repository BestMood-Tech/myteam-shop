import { Address } from './address.model';
import { Currency } from './currency.model';

interface Profile {
  nickName: string;
  firstName: string;
  lastName: string;
  name: string;
  phone: string;
  mobile: string;
  email: string;
  country: string;
  currency: string;
  picture: string;
  address: Address[];
}

export interface Invoice {
  id: string;
  user: Profile;
  address: Address;
  products: { name: string, desc: string, price: number, count: number, total: number }[];
  number: number;
  date: string;
  total: number;
  tax: number;
  grandTotal: number;
  currency: string;
  payment: string;
}

export class User {
  id: string;
  nickName: string;
  picture: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  mobile: string;
  country: string;
  address: Address[];
  orders = [];
  currency: string = Currency.getCurrency()[0].value;

  constructor(obj) {
    for (const key of Object.keys(obj)) {
      if (key !== 'address') {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].replace(/[\uD800-\uDFFF]./g, '');
        }
        this[key] = obj[key];
      } else {
        this[key] = obj[key].map(value => new Address(value));
      }
    }

    if (!this.address) {
      this.address = [];
    }
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get userProfile(): Profile {
    return {
      nickName: this.nickName,
      firstName: this.firstName,
      lastName: this.lastName,
      name: `${this.lastName} ${this.firstName}`,
      phone: this.phone,
      mobile: this.mobile,
      email: this.email,
      country: this.country,
      currency: this.currency,
      picture: this.picture,
      address: this.address,
    };
  }

  public updateAddress(key, address) {
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

  public addOrders(item) {
    this.orders.push(item);
    return item;
  }

  public getOrderById(id) {
    return this.orders.find(order => order.id === id);
  }

  public deleteAddress(key) {
    this.address.splice(key, 1);
  }
}
