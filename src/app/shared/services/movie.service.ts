import { Injectable } from '@angular/core';
import { URLSearchParams, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MovieService {
  private key = '544ce33d881d9c8b4f234cc65fa42475';
  private language = 'en-US';
  private baseURL = 'http://api.themoviedb.org/3/';

  constructor(private http: Http) {
  }

  private getParams(): URLSearchParams {
    let params = new URLSearchParams();
    params.set('api_key', this.key);
    params.set('language', this.language);
    return params;
  }

  public getItem(id) {

    let getItemURL = `${this.baseURL}movie/${id}`;

    let params = this.getParams();

    let options = new RequestOptions({
      search: params
    });

    return this.http
      .get(getItemURL, options)
      .map(res => res.json());
  }

  public search(query, filters?) {
    let searchURL = `${this.baseURL}search/movie`;

    let params = this.getParams();
    params.set('query', query);

    if(filters) {
      for (let value of Object.keys(filters)) {
        params.set(value, filters[value]);
      }
    }

    let options = new RequestOptions({
      search: params
    });

    return this.http
      .get(searchURL, options)
      .map(res => res.json());
  }

  public recent() {
    let latestURL = `${this.baseURL}movie/now_playing`;

    let params = this.getParams();
    params.set('page', '1');

    let options = new RequestOptions({
      search: params
    });

    return this.http
      .get(latestURL, options)
      .map(res => res.json());
  }

  public processData(data) {
    let results = data.results;
    return results.map(function(movie){
      return {
        id: movie.id,
        type: 'movie',
        name: movie.title,
        cover: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        description: movie.overview,
        price: movie.vote_average * 20 / 10
      };
    });
  }

  public processItem(movie) {
    return {
      id: movie.id,
      type: 'movie',
      name: movie.title,
      cover: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      description: movie.overview,
      genres: movie.genres,
      production_companies: movie.production_companies,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      price: movie.vote_average * 20 / 10
    };
  }
}
