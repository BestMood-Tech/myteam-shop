export class Currency {
  private static currency = {
    dollar: ["USD","$"],
    euro: ["EUR","€"],
    ruble: ["RUB","₽"]
  };

  public static getCurrency() {
      return this.currency;
  }

  public static getCurrencyArray() {
    let curArray = [];

    for(let cur of Object.keys(this.currency)) {
      curArray.push(this.currency[cur]);
    }

    return curArray;
  }

}
