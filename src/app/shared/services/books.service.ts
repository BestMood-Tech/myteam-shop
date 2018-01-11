import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import * as moment from 'moment';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Product } from '../models';

@Injectable()
export class BooksService {

  private data: Product[];
  private isLoading: boolean;
  private baseUrl = 'https://api.wattpad.com/v4/stories';

  static getHeaders(): HttpHeaders {
    const apiKey = 'tEIdSUrwgw7TWjk5ymOxk4JIbUlxIXMEVkI5IJwu65t9';
    return new HttpHeaders()
      .set('Authorization', `Basic ${apiKey}`)
      .set('Accept', 'application/json')
      .set('accept-language', 'en');
  }

  static getParams(): HttpParams {
    return new HttpParams()
      .set('limit', '20')
      .set('offset', '0')
      .set('category', '3');
  }

  constructor(private httpClient: HttpClient) {
  }

  public getItems(): Observable<Product[]> {
    if ((!this.data || !this.data.length) && !this.isLoading) {
      this.isLoading = true;
      return this.httpClient.get(this.baseUrl, this.options)
        .map((result: any) => result.stories)
        .map((data) => {
          this.data = this.convertItems(data);
          this.isLoading = false;
          return this.data;
        });
    }
    return Observable.of(this.data);
  }

  public getItem(id: string): Observable<Product> {
    return this.getItems().map((data) => data.find((item) => parseInt(item.id, 10) === parseInt(id, 10)));
  }

  public search(query: string): Observable<Product[]> {
    return this.getItems().map((data) => data.filter((item) => item.name.toUpperCase().indexOf(query.toUpperCase()) !== -1));
  }

  public getRecommended(id: string): Observable<Product[]> {
    return this.getItems().map((data) => data.filter((item) => parseInt(item.id, 10) !== parseInt(id, 10)));
  }

  private convertItems(data: any[]): Product[] {
    return data.map((item) => {
      return new Product({
        id: item.id,
        type: 'book',
        name: item.title,
        cover: item.cover,
        description: item.description,
        price: Math.floor(Math.random() * 10 + 1),
        voteCount: item.voteCount,
        readCount: item.readCount,
        year: moment(item.createDate).format('YYYY'),
        homepage: item.url
      });
    });
  }

  private get options() {
    return {
      headers: BooksService.getHeaders(),
      params: BooksService.getParams()
    };
  }
}
