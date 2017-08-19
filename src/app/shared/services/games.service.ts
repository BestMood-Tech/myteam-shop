import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

import { Developer, Genre, Product } from '../models/product.model';

@Injectable()
export class GamesService {
  private data: Product[];
  private isLoading: boolean;
  private baseUrl = 'https://igdbcom-internet-game-database-v1.p.mashape.com/';

  static getParams(): URLSearchParams {
    const params = new URLSearchParams();
    params.set('fields', '*');
    return params;
  }

  static getHeaders(): Headers {
    const xMashapeKey = 'mOOXc4tX8Pmsh0FpTzd1KwlWjSHhp1MuPfXjsnCJsAUgGEcL9O';
    const headers = new Headers();
    headers.set('X-Mashape-Key', xMashapeKey);
    headers.set('Accept', 'application/json');
    return headers;
  }

  constructor(private http: Http) {
  }

  public getItems(): Observable<Product[]> {
    if ((!this.data || !this.data.length) && !this.isLoading) {
      this.isLoading = true;
      return this.http.get(`${this.baseUrl}games/`, this.options({ order: 'popularity:desc', limit: '20' }))
        .map((response) => response.json())
        .map((data) => {
          this.data = this.convertItems(data);
          this.isLoading = false;
          return this.data;
        });
    }
    return Observable.of(this.data);
  }

  public getItem(id: string): Observable<Product> {
    return this.http.get(`${this.baseUrl}games/${id}`, this.options())
      .map((response) => response.json()[0])
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

    return this.http.get(`${this.baseUrl}games/`, this.options(additionalParams))
      .map((response) => response.json())
      .map((data) => this.convertItems(data));
  }

  public getRecommended(id: string): Observable<Product[]> {
    return this.getItems().map((data) => data.filter((item) => parseInt(item.id, 10) !== parseInt(id, 10)));
  }

  public getDevelopers(ids: number[]): Observable<Developer[]> {
    if (!ids || !ids.length) {
      return Observable.from([]);
    }
    const idsString = ids.join();
    return this.http.get(`${this.baseUrl}companies/${idsString}`, this.options({ fields: 'name' }))
      .map((response) => response.json());
  }

  public getGenres(ids: number[]): Observable<Genre[]> {
    if (!ids || !ids.length) {
      return Observable.from([]);
    }
    const idsString = ids.join();
    return this.http.get(`${this.baseUrl}genres/${idsString}`, this.options({ fields: 'name' }))
      .map(res => res.json());
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
          `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${item.cover.cloudinary_id}.jpg` : 'http://placehold.it/320x150',
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
        `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${item.cover.cloudinary_id}.jpg` : 'http://placehold.it/320x150',
      description: item.summary || `this game hasn't description yet.`
    });
  }

  private options(params?: any): RequestOptions {
    const defaultParams = GamesService.getParams();
    if (params) {
      Object.keys(params).forEach((key) => defaultParams.set(key, params[key]));
    }
    return new RequestOptions({
      headers: GamesService.getHeaders(),
      search: defaultParams
    })
  }

}
