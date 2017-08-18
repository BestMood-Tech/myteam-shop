import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {

  public transform(value: any, currency: string): any {
    switch (currency) {
      case '₽' :
        return (value * 64.15).toFixed(2);
      case '€' :
        return (value - (value * 0.0631)).toFixed(2);
      default:
        return value;
    }
  }

}
