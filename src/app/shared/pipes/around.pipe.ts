import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'around'
})
export class AroundPipe implements PipeTransform {

  public transform(value: any): any {
    if (value >= 1000 && value <= 1000000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
  }

}
