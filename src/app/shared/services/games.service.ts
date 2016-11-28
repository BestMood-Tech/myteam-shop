import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GamesService {

  private baseUrl = 'https://igdbcom-internet-game-database-v1.p.mashape.com/';
  private xMashapeKey = 'mOOXc4tX8Pmsh0FpTzd1KwlWjSHhp1MuPfXjsnCJsAUgGEcL9O';

  constructor(private _http: Http) {
  }

  private getParams(): URLSearchParams {
    let params = new URLSearchParams();
    params.set('fields', '*');
    params.set('limit', '6');
    return params;
  }

  private getHeaders(): Headers {
    let headers = new Headers();
    headers.set('X-Mashape-Key', this.xMashapeKey);
    headers.set('Accept', 'application/json');
    return headers;
  }

  getItem(id) {
    let getItemUrl = `${this.baseUrl}games/${id}`;

    let options = new RequestOptions({
      search: this.getParams(),
      headers: this.getHeaders()
    });

    return this._http.get(getItemUrl, options)
      .map(res => res.json());
  }

  search(query, filters) {
    let getItemUrl = `${this.baseUrl}games/`;
    let params = this.getParams();
    params.set(`filter[name][eq]`, query);

    for (let value of Object.keys(filters)) {
      params.set(`filter[${value}][eq]`, filters[value]);
    }

    let options = new RequestOptions({
      search: this.getParams(),
      headers: this.getHeaders()
    });

    return this._http.get(getItemUrl, options)
      .map(res => res.json());
  }

  latest() {
    let getItemUrl = `${this.baseUrl}games/`;
    let params = this.getParams();

    params.set('order', 'release_dates.date:desc');
    let options = new RequestOptions({
      search: params,
      headers: this.getHeaders()
    });

    return this._http.get(getItemUrl, options)
      .map(res => res.json());
  }
}
