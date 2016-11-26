import { Injectable } from '@angular/core';
import { URLSearchParams, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MovieService {
  private key = "544ce33d881d9c8b4f234cc65fa42475";
  private language ="en-US";
  private baseURL = "http://api.themoviedb.org/3/"

  constructor(private _http:Http) {
  }

  getItem(id) {

    let getItemURL = `${this.baseURL}${id}`;

    let params = new URLSearchParams();
    params.set("api_key",this.key);
    params.set("language",this.language);

    let options = new RequestOptions({
      search: params
    });

    return this._http
      .get(getItemURL,options)
      .map(res => res.json());
  }

  search(query, filters) {
    let searchURL = `${this.baseURL}search/movie/`;

    let params = new URLSearchParams();
    params.set("api_key",this.key);
    params.set("language",this.language);
    params.set("query",query);

    for(let value of Object.keys(filters)) {
      params.set(value,filters[value]);
    }

    let options = new RequestOptions({
      search: params
    });

    return this._http
      .get(searchURL,options)
      .map(res => res.json());
  }

  latest() {
    let latestURL = `${this.baseURL}movie/latest`;

    let params = new URLSearchParams();
    params.set("api_key",this.key);
    params.set("language",this.language);

    let options = new RequestOptions({
      search: params
    });

    return this._http
      .get(latestURL,options)
      .map(res => res.json());
  }


}
