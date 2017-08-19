import { Address } from './address.model';
import { Product } from './product.model';

export class Order {
  public id: string;
  public products: Product[];
  public total: number;
  public tax: number;
  public currency: string;
  public grandTotal: number;
  public payment: string;
  public addressOrder: Address;
  public createdAt: string;
  public createdBy: Date;

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
