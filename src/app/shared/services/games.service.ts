import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';

import { Developer, Genre, Product } from '../models';

@Injectable()
export class GamesService {
  private data: Product[];
  private isLoading: boolean;
  private baseUrl = '/games_api/';

  static getParams(): HttpParams {
    return new HttpParams()
      .set('fields', '*');
  }

  static getHeaders(): HttpHeaders {
    const userKey = '1ce166ae276a59f478a836ff4398eb50';
    return new HttpHeaders()
      .set('user-key', userKey)
      .set('Accept', 'application/json');
  }

  constructor(private httpClient: HttpClient) {
  }

  public getItems(): Observable<Product[]> {
    if ((!this.data || !this.data.length) && !this.isLoading) {
      this.isLoading = true;
      return this.httpClient.get(`${this.baseUrl}games/`, this.options({ order: 'popularity:desc', limit: '20' }))
        .map((data: any) => {
          this.data = this.convertItems(data);
          this.isLoading = false;
          return this.data;
        });
    }
    return Observable.of(this.data);
  }

  public getItem(id: string): Observable<Product> {
    return this.httpClient.get(`${this.baseUrl}games/${id}`, this.options())
      .map((result) => result[0])
      .map((data) => this.convertItem(data));
  }

  public search(query: string, filters?: any): Observable<Product[]> {
    const additionalParams = {};
    additionalParams['search'] = query;
    if (filters) {
      Object.keys(filters).forEach((value) => {
        if (value === 'limit') {
          additionalParams['limit'] = filters[value];
        } else {
          additionalParams[`filter[${value}][eq]`] = filters[value];
        }
      });
    }

    return this.httpClient.get(`${this.baseUrl}games/`, this.options(additionalParams))
      .map((data: any) => this.convertItems(data));
  }

  public getRecommended(id: string): Observable<Product[]> {
    return this.getItems().map((data) => data.filter((item) => parseInt(item.id, 10) !== parseInt(id, 10)));
  }

  public getDevelopers(ids: number[]): Observable<Developer[]> {
    if (!ids || !ids.length) {
      return Observable.from([]);
    }
    const idsString = ids.join();
    return this.httpClient.get<Developer[]>(`${this.baseUrl}companies/${idsString}`, this.options({ fields: 'name' }));
  }

  public getGenres(ids: number[]): Observable<Genre[]> {
    if (!ids || !ids.length) {
      return Observable.from([]);
    }
    const idsString = ids.join();
    return this.httpClient.get<Genre[]>(`${this.baseUrl}genres/${idsString}`, this.options({ fields: 'name' }))
  }

  private convertItems(data: any[]): Product[] {
    return data.map((item) => {
      return new Product({
        id: item.id,
        type: 'game',
        name: item.name,
        price: Math.floor(item.popularity / 10),
        year: moment(item.first_release_date).format('YYYY'),
        vote: item.popularity % 5 === 0 ? 5 : item.popularity % 5 < 2 ? item.popularity % 5 + 2 : item.popularity % 5,
        voteCount: item.collection,
        trailer: item.videos ? item.videos[0].video_id : '',
        cover: item.cover ?
          `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${item.cover.cloudinary_id}.jpg` :
          'httpClient://placehold.it/320x150',
        description: item.summary || `this game hasn't description yet.`
      });
    });
  }

  private convertItem(item: any): Product {
    return new Product({
      id: item.id,
      type: 'game',
      name: item.name,
      genres: item.genres,
      developers: item.developers,
      year: moment(item.first_release_date).format('YYYY'),
      price: Math.floor(item.popularity / 10),
      vote: item.popularity % 5 === 0 ? 5 : item.popularity % 5 < 2 ? item.popularity % 5 + 2 : item.popularity % 5,
      trailer: item.videos ? item.videos[0].video_id : '',
      websites: item.websites,
      esrb: item.esrb ? item.esrb.rating : '',
      status: item.status || '',
      cover: item.cover ?
        `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${item.cover.cloudinary_id}.jpg` : 'httpClient://placehold.it/320x150',
      description: item.summary || `this game hasn't description yet.`
    });
  }

  private options(params?: any) {
    const defaultParams = GamesService.getParams();
    if (params) {
      Object.keys(params).forEach((key) => defaultParams.set(key, params[key]));
    }
    return {
      headers: GamesService.getHeaders(),
      params: defaultParams
    }
  }
}
