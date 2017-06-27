import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratio'
})
export class RatioPipe implements PipeTransform {

  public transform(value: string): any {
    return parseFloat(value) > 5 ? (parseFloat(value) / 2).toFixed(1) :
      parseFloat(value).toFixed(1);
  }
}
