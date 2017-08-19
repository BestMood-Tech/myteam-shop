import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, URLSearchParams } from '@angular/http';

import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { Product } from '../models/product.model';

@Injectable()
export class BooksService {

  private data: Product[];
  private isLoading: boolean;
  private baseUrl = 'https://api.wattpad.com/v4/stories';

  static getHeaders(): Headers {
    const apiKey = 'tEIdSUrwgw7TWjk5ymOxk4JIbUlxIXMEVkI5IJwu65t9';
    const headers = new Headers();
    headers.set('Authorization', `Basic ${apiKey}`);
    headers.set('Accept', 'application/json');
    headers.set('accept-language', 'en');
    return headers;
  }

  static getParams(): URLSearchParams {
    const params = new URLSearchParams();
    params.set('limit', '20');
    params.set('offset', '0');
    params.set('category', '3');
    return params;
  }

  constructor(private http: Http) {
  }

  public getItems(): Observable<Product[]> {
    if ((!this.data || !this.data.length) && !this.isLoading) {
      this.isLoading = true;
      return this.http.get(this.baseUrl, this.options)
        .map((response) => response.json().stories)
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

  private get options(): RequestOptions {
    return new RequestOptions({
      headers: BooksService.getHeaders(),
      params: BooksService.getParams()
    });
  }
}
