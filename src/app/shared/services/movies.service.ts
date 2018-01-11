import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as moment from 'moment';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Credit, Product } from '../models';

@Injectable()
export class MoviesService {
  private data: Product[];
  private isLoading: boolean;
  private baseURL = 'http://api.themoviedb.org/3/';

  static getParams(): HttpParams {
    const key = '544ce33d881d9c8b4f234cc65fa42475';
    const language = 'en-US';
    return new HttpParams()
      .set('api_key', key)
      .set('language', language);
  }

  constructor(private httpClient: HttpClient) {
  }

  public getItems(): Observable<Product[]> {
    if ((!this.data || !this.data.length) && !this.isLoading) {
      this.isLoading = true;
      return this.httpClient
        .get(`${this.baseURL}movie/now_playing`, this.options({ page: '1' }))
        .map((result: any) => result.results)
        .map((data) => {
          this.data = this.convertItems(data);
          this.isLoading = false;
          return this.data;
        });
    }
    return Observable.of(this.data);
  }

  public getItem(id: string): Observable<Product> {
    return this.httpClient
      .get(`${this.baseURL}movie/${id}`, this.options())
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
    return this.httpClient
      .get(`${this.baseURL}search/movie`, this.options(additionalParams))
      .map((result: any) => result.results)
      .map((data) => this.convertItems(data));
  }

  public getRecommended(id: string): Observable<Product[]> {
    return this.getItems().map((data) => data.filter((item) => parseInt(item.id, 10) !== parseInt(id, 10)));
  }

  public getCredits(id): Observable<Credit[]> {
    return this.httpClient
      .get(`${this.baseURL}movie/${id}/credits`, this.options())
      .map((result: any) => result.cast)
      .map((data) => data.map((item) => {
        return {
          profilePath: item.profile_path ? 'https://image.tmdb.org/t/p/w138_and_h175_bestv2' + item.profile_path :
            'httpClient://placehold.it/138x175',
          name: item.name
        };
      }).slice(0, 4));
  }

  public getVideos(id: string): Observable<any> {
    return this.httpClient
      .get(`${this.baseURL}movie/${id}/videos`, this.options())
      .map((result: any) => result.results)
      .map((data) => {
        return data.filter((item) => item.site === 'YouTube' && item.type === 'Trailer')[0];
      });
  }

  private convertItems(data: any[]): Product[] {
    return data.map((item) => {
      return new Product({
        id: item.id,
        type: 'movie',
        name: item.title,
        cover: `https://image.tmdb.org/t/p/w780${item.poster_path}`,
        description: item.overview,
        vote: item.vote_average,
        voteCount: item.vote_count,
        price: item.vote_average * 20 / 10,
        year: item.release_date.split('-')[0]
      });
    });
  }

  private convertItem(item: any) {
    return {
      id: item.id,
      type: 'movie',
      name: item.title,
      cover: `https://image.tmdb.org/t/p/w780${item.poster_path}`,
      description: item.overview,
      genres: item.genres,
      productionCompanies: item.production_companies,
      voteAverage: item.vote_average,
      year: moment(item.release_date).format('YYYY'),
      price: item.vote_average * 20 / 10,
      vote: item.vote_average,
      homepage: item.homepage || ''
    };
  }

  private options(params?: any) {
    const defaultParams = MoviesService.getParams();
    if (params) {
      Object.keys(params).forEach((key) => defaultParams.set(key, params[key]));
    }
    return {
      params: defaultParams
    }
  }
}
