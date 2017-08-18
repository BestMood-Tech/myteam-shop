export class Review {
  public id: string;
  public username: string;
  public createDate: string;
  public text: string;
  public rate: number;
  public productID: string;

  constructor(obj) {
    Object.keys(obj).forEach((key) => {
      this[key] = obj[key];
    });
  }
}
