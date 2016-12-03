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
    return `City: ${this.city}, Street: ${this.streetAddress}, Zip: ${this.zip}`;
  }

  toJson() {
    return JSON.stringify(this)
  }
}
