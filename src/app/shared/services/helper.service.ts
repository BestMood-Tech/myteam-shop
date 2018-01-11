import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

export interface Country {
  name: string;
  value: string;
}

@Injectable()
export class HelperService {
  public showFilters = new EventEmitter<boolean>();

  constructor(private httpClient: HttpClient) {
  }

  public getCountries(): Observable<Country[]> {
    return this.httpClient
      .get(`https://restcountries.eu/rest/v1/all`)
      .map((data: any[]) => data.map((item) => ({ value: item.name, name: item.name })));
  }

}
