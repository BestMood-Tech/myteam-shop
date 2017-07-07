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

    this.updateLSUser(this.nickName, this.toJson());
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

  get userAddress(): Address[] {
    return this.address;
  }

  get userOrders(): string[] {
    return this.orders;
  }

  public updateProfile(profile) {
    if (!profile) {
      return;
    }

    for (const key of Object.keys(profile)) {
      if (typeof profile[key] === 'string') {
        profile[key] = profile[key].replace(/[\uD800-\uDFFF]./g, '');
      }
      this[key] = profile[key];
    }
    this.updateLSUser(this.nickName, this.toJson());
  }

  public updateAddress(key, address) {
    if (!address) {
      return;
    }
    this.address[key] = address;
    this.updateLSUser(this.nickName, this.toJson());
  }

  public addAddress(address: Address) {
    if (!address) {
      return;
    }
    this.address.push(address);
    this.updateLSUser(this.nickName, this.toJson());
  }

  public addOrders(item) {
    item.id = this.uniqueID();
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

  public getInvoice(id): Invoice {
    const order = this.orders.find(item => item.id === id);
    return {
      id: order.id,
      number: Math.floor(Math.random() * 100) + 1,
      date: (new Date(order.date)).toLocaleDateString(),
      address: order.addressOrder,
      currency: order.currency,
      payment: order.formProfile.payment,
      products: order.orders.map(item => {
        return {
          title: item.name.replace(/([\uD800-\uDFFF].)|([^\x00-\x7F])/g, ''),
          desc: item.description.substr(0, 130).replace(/([\uD800-\uDFFF].)|\n|([^\x00-\x7F])/g, ''),
          price: item.price,
          count: item.count,
          total: item.total,
        };
      }),
      user: this.userProfile,
      total: order.total,
      tax: order.tax,
      grandTotal: order.grandTotal,
    };
  }

  private uniqueID() {
    function chr4() {
      return Math.random().toString(16).slice(-4);
    }

    return chr4() + chr4() +
      '-' + chr4() +
      '-' + chr4() +
      '-' + chr4() +
      '-' + chr4() + chr4() + chr4();
  }


}
