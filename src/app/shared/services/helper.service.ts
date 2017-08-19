import { EventEmitter, Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

export interface Country {
  name: string;
  value: string;
}

@Injectable()
export class HelperService {
  public showFilters = new EventEmitter<boolean>();
  public updateFilters = new EventEmitter<any>();
  public searchTerm: string;

  constructor(private http: Http) {
  }

  public getCountries(): Observable<Country[]> {
    return this.http
      .get(`https://restcountries.eu/rest/v1/all`)
      .map((response) => response.json())
      .map((data) => data.map((item) => {
        return { value: item.name, name: item.name };
      }));
  }

}
