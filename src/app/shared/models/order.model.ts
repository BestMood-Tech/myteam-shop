import { Address } from './address.model';

export class Order {
  public id: string;
  public products;
  public total: number;
  public tax: number;
  public currency: string;
  public grandTotal: number;
  public payment: string;
  public addressOrder;
  public createdAt: string;
  public createdBy: string;

  constructor(obj) {
    Object.keys(obj).forEach((key) => {
      if (key !== 'addressOrder') {
        this[key] = obj[key];
      } else {
        this[key] = new Address(obj[key]);
      }
    });
  }
}
