import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/map';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

import { Credit, Product } from '../models/product.model';

@Injectable()
export class MoviesService {
  private data: Product[];
  private isLoading: boolean;
  private baseURL = 'http://api.themoviedb.org/3/';

  static getParams(): URLSearchParams {
    const key = '544ce33d881d9c8b4f234cc65fa42475';
    const language = 'en-US';
    const params = new URLSearchParams();
    params.set('api_key', key);
    params.set('language', language);
    return params;
  }

  constructor(private http: Http) {
  }

  public getItems(): Observable<Product[]> {
    if ((!this.data || !this.data.length) && !this.isLoading) {
      this.isLoading = true;
      return this.http
        .get(`${this.baseURL}movie/now_playing`, this.options({ page: '1' }))
        .map((response) => response.json().results)
        .map((data) => {
          this.data = this.convertItems(data);
          this.isLoading = false;
          return this.data;
        });
    }
    return Observable.of(this.data);
  }

  public getItem(id: string): Observable<Product> {
    return this.http
      .get(`${this.baseURL}movie/${id}`, this.options())
      .map((response) => response.json())
      .map((data) => this.convertItem(data));
  }

  public search(query: string, filters?: any): Observable<Product[]> {
    const additionalParams = {};
    additionalParams['query'] = query;

    if (filters) {
      Object.keys(filters).forEach((value) => {
        additionalParams[value] = filters[value];
      });
    }
    return this.http
      .get(`${this.baseURL}search/movie`, this.options(additionalParams))
      .map((response) => response.json().results)
      .map((data) => this.convertItems(data));
  }

  public getRecommended(id: string): Observable<Product[]> {
    return this.getItems().map((data) => data.filter((item) => parseInt(item.id, 10) !== parseInt(id, 10)));
  }

  public getCredits(id): Observable<Credit[]> {
    return this.http
      .get(`${this.baseURL}movie/${id}/credits`, this.options())
      .map((response) => response.json().cast)
      .map((data) => data.map((item) => {
        return {
          profilePath: item.profile_path ? 'https://image.tmdb.org/t/p/w138_and_h175_bestv2' + item.profile_path :
            'http://placehold.it/138x175',
          name: item.name
        };
      }));
  }

  public getVideos(id: string): Observable<any> {
    return this.http
      .get(`${this.baseURL}movie/${id}/videos`, this.options())
      .map((response) => response.json().results)
      .map((data) => {
        return data.filter((item) => item.site === 'YouTube' && item.type === 'Trailer')[0];
      });
  }

  private convertItems(data: any[]): Product[] {
    return data.map((movie) => {
      return new Product({
        id: movie.id,
        type: 'movie',
        name: movie.title,
        cover: `https://image.tmdb.org/t/p/w780${movie.poster_path}`,
        description: movie.overview,
        vote: movie.vote_average,
        voteCount: movie.vote_count,
        price: movie.vote_average * 20 / 10,
        year: movie.release_date.split('-')[0]
      });
    });
  }

  private convertItem(movie) {
    return {
      id: movie.id,
      type: 'movie',
      name: movie.title,
      cover: `https://image.tmdb.org/t/p/w780${movie.poster_path}`,
      description: movie.overview,
      genres: movie.genres,
      productionCompanies: movie.production_companies,
      voteAverage: movie.vote_average,
      year: moment(movie.release_date).format('YYYY'),
      price: movie.vote_average * 20 / 10,
      vote: movie.vote_average,
      homepage: movie.homepage || ''
    };
  }

  private options(params?: any): RequestOptions {
    const defaultParams = MoviesService.getParams();
    if (params) {
      Object.keys(params).forEach((key) => defaultParams.set(key, params[key]));
    }
    return new RequestOptions({
      search: defaultParams
    })
  }
}
