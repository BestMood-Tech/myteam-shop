import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BooksService {
  private baseUrl = 'https://api.wattpad.com/v4/';
  private apiKey = 'tEIdSUrwgw7TWjk5ymOxk4JIbUlxIXMEVkI5IJwu65t9';

  constructor(private http: Http) {
  }

  public getStories() {
    let options = new RequestOptions({
      headers: this.getHeaders(),
      params: this.getParams()
    });
    return this.http.get(`${this.baseUrl}stories`, options).map((res) => res.json());
  }

  public getItem(id) {
    let options = new RequestOptions({
      headers: this.getHeaders(),
      params: this.getParams()
    });
    return this.http.get(`${this.baseUrl}stories`, options).map((res) => {
      return res.json().stories.filter((item) => item.id === parseInt(id, 10))
    });
  }

  public processData(data) {
    let results = data.stories;
    return results.map((item) =>{
      return {
        id: item.id,
        type: 'books',
        name: item.title,
        cover: item.cover,
        description: item.description,
        price: Math.floor(Math.random() * 10 + 1)
      };
    });
  }

  public processItem(data) {
    let resultingData = data.map((book) => {
      let tempObject = {
        id: book.id,
        type: 'books',
        name: book.title,
        description: book.description,
        cover: book.cover,
        release_date: book.createDate,
        price: Math.floor(Math.random() * 10 + 1)
      };

      return tempObject;
    });

    return resultingData[0];
  }

  private getHeaders(): Headers {
    let headers = new Headers();
    headers.set('Authorization', `Basic ${this.apiKey}`);
    headers.set('Accept', 'application/json');
    headers.set('accept-language', 'en');
    return headers;
  }

  private getParams(): URLSearchParams {
    let params = new URLSearchParams();
    params.set('limit', '20');
    params.set('offset', '0');
    params.set('category', '3');
    return params;
  }
}