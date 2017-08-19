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
  public createdAt: Date;
  public createdBy: string;

  constructor(obj) {
    Object.keys(obj).forEach((key) => {
      switch (key) {
        case 'addressOrder':
          this.addressOrder = obj[key];
          break;
        case 'createdAt':
          this.createdAt = new Date(obj.key);
          break;
        case 'products':
          this.products = obj[key].map((item) => new Product(item));
          break;
        default:
          this[key] = obj[key];
      }
    });
  }
}
