export class Currency {

  private static currency = [
    {name: 'USD', value: '$'},
    {name: 'EUR', value: '€'},
    {name: 'RUB', value: '₽'}
  ];

  public static getCurrency() {
    return this.currency;
  }

}
