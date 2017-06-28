export class Address {
  country: string;
  streetAddress: string;
  addressLine2: string;
  zip: string;
  city: string;
  state: string;

  constructor(obj) {
    for (const key of Object.keys(obj)) {
      this[key] = obj[key];
    }
  }
}
