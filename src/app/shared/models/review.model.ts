export class Review {
  public id: string;
  public username: string;
  public createDate: Date;
  public text: string;
  public rate: number;
  public productID: string;

  constructor(obj) {
    for (const key in obj) {
      if (key === 'createDate') {
        this.createDate = new Date(obj[key]);
      } else {
        this[key] = obj[key];
      }
    }
  }
}
