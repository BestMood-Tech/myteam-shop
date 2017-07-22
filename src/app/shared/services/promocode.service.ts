import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

const baseUrl = 'https://m81j11ueq7.execute-api.eu-central-1.amazonaws.com/dev/promocode/';

@Injectable()
export class PromocodeService {
  constructor(private http: Http) {
  }

  public create(isNewUser: boolean, orderCount?: number) {
    return this.http.put(`${baseUrl}create`,
      { isNewUser, orderCount }, this.setOptions())
      .map((response) => response.json());
  }

  public get() {
    return this.http.get(`${baseUrl}get`,
      this.setOptions())
      .map((response) => response.json());
  }

  public check(promocode: string) {
    return this.http.put(`${baseUrl}check`,
      { promocode }, this.setOptions())
      .map((response) => response.json());
  }

  private setOptions() {
    const token = localStorage.getItem('id_token');
    if (!token) {
      return;
    }
    const myHeaders = new Headers();
    myHeaders.set('Authorization', `Bearer ${token}`);
    return new RequestOptions({
      headers: myHeaders
    });
  }
}
