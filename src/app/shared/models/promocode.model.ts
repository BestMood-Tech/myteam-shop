export class Promocode {
  public id: string;
  public promocode: string;
  public percent: number;

  constructor(obj) {
    for (const key in obj) {
      this[key] = obj[key];
    }
  }
}
