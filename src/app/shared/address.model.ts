export class Address {
  street: string;
  zip: string;
  city: string;

  constructor(obj) {
      this.city = obj.city,
      this.street = obj.street,
      this.zip = obj.zip;
  }

  public getAddress() {
    return `City: ${this.city}, Street: ${this.street}, Zip: ${this.zip}`;
  }

  toJson() {
    return JSON.stringify(this)
  }
}
