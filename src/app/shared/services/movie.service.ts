import { Injectable } from '@angular/core';
import { URLSearchParams, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

@Injectable()
export class MovieService {
  public data: any[];
  private key = '544ce33d881d9c8b4f234cc65fa42475';
  private language = 'en-US';
  private baseURL = 'http://api.themoviedb.org/3/';

  constructor(private http: Http) {
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    params.set('api_key', this.key);
    params.set('language', this.language);
    return params;
  }

  public getItem(id) {

    const getItemURL = `${this.baseURL}movie/${id}`;

    const params = this.getParams();

    const options = new RequestOptions({
      search: params
    });

    return this.http
      .get(getItemURL, options)
      .map(res => res.json());
  }

  public search(query, filters?) {
    const searchURL = `${this.baseURL}search/movie`;

    const params = this.getParams();
    params.set('query', query);

    if (filters) {
      for (const value of Object.keys(filters)) {
        params.set(value, filters[value]);
      }
    }

    const options = new RequestOptions({
      search: params
    });

    return this.http
      .get(searchURL, options)
      .map(res => res.json());
  }

  public recent() {
    const latestURL = `${this.baseURL}movie/now_playing`;

    const params = this.getParams();
    params.set('page', '1');

    const options = new RequestOptions({
      search: params
    });

    return this.http
      .get(latestURL, options)
      .map(res => res.json());
  }

  public processData(data) {
    this.data = data.results.map((movie) => {
      return {
        id: movie.id,
        type: 'movie',
        name: movie.title,
        cover: `https://image.tmdb.org/t/p/w780${movie.poster_path}`,
        description: movie.overview,
        vote: movie.vote_average,
        voteCount: movie.vote_count,
        price: movie.vote_average * 20 / 10,
        year: movie.release_date.split('-')[0]
      };
    });
    return this.data;
  }

  public getCredits(id) {
    const getItemURL = `${this.baseURL}movie/${id}/credits`;

    const params = this.getParams();

    const options = new RequestOptions({
      search: params
    });

    return this.http
      .get(getItemURL, options)
      .map(res => res.json().cast)
      .map((casts) => casts.map((item) => {
        return {
          profile_path: 'https://image.tmdb.org/t/p/w138_and_h175_bestv2' + item.profile_path,
          name: item.name
        };
      }));
  }

  public getVideos(id) {
    const getItemURL = `${this.baseURL}movie/${id}/videos`;

    const params = this.getParams();

    const options = new RequestOptions({
      search: params
    });

    return this.http
      .get(getItemURL, options)
      .map(res => res.json().results)
      .map((data) => {
        return data.filter((item) => item.site === 'YouTube' && item.type === 'Trailer' &&
        item.name.indexOf('Trailer') !== -1 && item.name.indexOf('Official') !== -1)[0];
      });
  }

  public getRecommended(movie) {
    return this.data.filter((item) => item.id !== movie.id);
  }

  public processItem(movie) {
    console.log(movie);
    return {
      id: movie.id,
      type: 'movie',
      name: movie.title,
      cover: `https://image.tmdb.org/t/p/w780${movie.poster_path}`,
      description: movie.overview,
      genres: movie.genres,
      production_companies: movie.production_companies,
      vote_average: movie.vote_average,
      release_date: moment(movie.release_date).format('YYYY'),
      price: movie.vote_average * 20 / 10,
      vote: movie.vote_average,
      homepage: movie.homepage || ''
    };
  }
}
