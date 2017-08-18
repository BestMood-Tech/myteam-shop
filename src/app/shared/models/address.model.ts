export class Address {
  public country: string;
  public streetAddress: string;
  public addressLine2: string;
  public zip: string;
  public city: string;
  public state: string;

  constructor(obj) {
    Object.keys(obj).forEach((key) => {
      this[key] = obj[key];
    });
  }
}
