import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

@Injectable()
export class BooksService {
  public data: any[];
  private baseUrl = 'https://api.wattpad.com/v4/';
  private apiKey = 'tEIdSUrwgw7TWjk5ymOxk4JIbUlxIXMEVkI5IJwu65t9';
  private options: RequestOptions;

  constructor(private http: Http) {
    this.options = new RequestOptions({
      headers: this.getHeaders(),
      params: this.getParams()
    });
  }

  public getStories() {
    return this.http.get(`${this.baseUrl}stories`, this.options).map((res) => res.json());
  }

  public getItem(id) {
    return this.http.get(`${this.baseUrl}stories`, this.options).map((res) => {
      return res.json().stories.filter((item) => item.id === parseInt(id, 10));
    });
  }

  public search(query) {
    return this.http.get(`${this.baseUrl}stories`, this.options)
      .map((res) => res.json())
      .map((res) => {
        res.stories = res.stories.filter((item) => item.title.indexOf(query) !== -1);
        return res;
      });
  }

  public processData(data) {
    this.data = data.stories.map((item) => {
      return {
        id: item.id,
        type: 'book',
        name: item.title,
        cover: item.cover,
        description: item.description,
        price: Math.floor(Math.random() * 10 + 1),
        voteCount: item.voteCount,
        readCount: item.readCount,
        year: moment(item.release_date).format('YYYY')
      };
    });
    return this.data;
  }

  public getRecommended(book) {
    return this.data.filter((item) => item.id !== book.id);
  }

  public processItem(data) {
    const resultingData = data.map((book) => {
      return {
        id: book.id,
        type: 'book',
        name: book.title,
        description: book.description,
        cover: book.cover,
        release_date: moment(book.release_date).format('YYYY'),
        voteCount: book.voteCount,
        readCount: book.readCount,
        price: Math.floor(Math.random() * 10 + 1)
      };
    });

    return resultingData[0];
  }

  private getHeaders(): Headers {
    const headers = new Headers();
    headers.set('Authorization', `Basic ${this.apiKey}`);
    headers.set('Accept', 'application/json');
    headers.set('accept-language', 'en');
    return headers;
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    params.set('limit', '20');
    params.set('offset', '0');
    params.set('category', '3');
    return params;
  }
}
