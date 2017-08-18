export class Promocode {
  public id: string;
  public promocode: string;
  public percent: number;

  constructor(obj) {
    Object.keys(obj).forEach((key) => {
      this[key] = obj[key];
    });
  }
}
