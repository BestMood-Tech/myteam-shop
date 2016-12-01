import { Injectable } from '@angular/core';
import { URLSearchParams, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MovieService {
  private key = '544ce33d881d9c8b4f234cc65fa42475';
  private language = 'en-US';
  private baseURL = 'http://api.themoviedb.org/3/';

  constructor(private _http: Http) {
  }

  private getParams(): URLSearchParams {
    let params = new URLSearchParams();
    params.set('api_key', this.key);
    params.set('language', this.language);
    return params;
  }

  getItem(id) {

    let getItemURL = `${this.baseURL}movie/${id}`;

    let params = this.getParams();

    let options = new RequestOptions({
      search: params
    });

    return this._http
      .get(getItemURL, options)
      .map(res => res.json());
  }

  search(query, filters) {
    let searchURL = `${this.baseURL}search/movie`;

    let params = this.getParams();
    params.set('query', query);

    for (let value of Object.keys(filters)) {
      params.set(value, filters[value]);
    }

    let options = new RequestOptions({
      search: params
    });

    return this._http
      .get(searchURL, options)
      .map(res => res.json());
  }

  recent() {
    let latestURL = `${this.baseURL}movie/now_playing`;

    let params = this.getParams();
    params.set('page', '1');

    let options = new RequestOptions({
      search: params
    });

    return this._http
      .get(latestURL, options)
      .map(res => res.json());
  }

  processData(data) {
    let results = data.results;
    let resultingData = results.map(function(movie){
      let _tempObject = {};
      _tempObject['type'] = 'movie';
      _tempObject['name'] = movie.original_title;
      _tempObject['cover'] = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      _tempObject['description'] = movie.overview;
      _tempObject['price'] = movie.vote_average * 20 / 10;
      return _tempObject;
    });

    return resultingData;
  }

}
