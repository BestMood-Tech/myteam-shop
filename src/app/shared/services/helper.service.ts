import { EventEmitter, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HelperService {
  public showFilters = new EventEmitter<boolean>();
  public updateFilters = new EventEmitter<any>();
  public searchTerm: string;

  constructor(private http: Http) {
  }

  public getCountry() {
    return this.http
      .get(`https://restcountries.eu/rest/v1/all`)
      .map((res) => {
        return res.json().map((item) => {
          return { value: item.name, name: item.name };
        });
      });
  }

}
