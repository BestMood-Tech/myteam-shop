export class Address {
  country: string;
  streetAddress: string;
  addressLine2: string;
  zip: string;
  city: string;
  state: string;

  constructor(obj) {
    for (let key of Object.keys(obj)) {
      this[key] = obj[key];
    }
  }

  public getAddress() {
    return `City: ${this.city}, streetAddress: ${this.streetAddress}, addressLine2: ${this.addressLine2}`;
  }

  public toJson() {
    return JSON.stringify(this)
  }
}
