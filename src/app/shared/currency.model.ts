export class Currency {
  // private static currency = {
  //   dollar: ['USD', '$'],
  //   euro: ['EUR', '€'],
  //   ruble: ['RUB', '₽']
  // };

  private static currency = [
    {name: 'USD', value: '$'},
    {name: 'EUR', value: '€'},
    {name: 'RUB', value: '₽'}
  ];

  public static getCurrency() {
    return this.currency;
  }

  public static getCurrencyArray() {
    const curArray = [];

    for (const cur of Object.keys(this.currency)) {
      curArray.push(this.currency[cur]);
    }

    return curArray;
  }

}
