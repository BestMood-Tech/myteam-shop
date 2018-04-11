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

  constructor(private http: Http) {
  }

  public getCountries(): Observable<Country[]> {
    return this.http
      .get(`/country_api/all`)
      .map((response) => response.json())
      .map((data) => data.map((item) => {
        return { value: item.name, name: item.name };
      }));
  }

}
