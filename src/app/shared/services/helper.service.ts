import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HelperService {

  constructor(private http: Http) {
  }

  public getCountry() {
    return this.http
      .get(`https://restcountries.eu/rest/v1/all`)
      .map(res => res.json());
  }

}
