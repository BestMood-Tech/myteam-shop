import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HelperService {

  constructor(private _http: Http){ }

  public getCountry(){
      return this._http
        .get("https://restcountries.eu/rest/v1/all")
        .map(res => res.json());
  }

}
