import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { baseUrl } from '../shared.module';

@Injectable()
export class PromocodeService {
  constructor(private http: Http) {
  }

  public create(isNewUser: boolean, orderCount?: number) {
    return this.http.put(`${baseUrl}promocode/create`,
      { isNewUser, orderCount }, this.setOptions())
      .map((response) => response.json());
  }

  public get() {
    return this.http.get(`${baseUrl}promocode/get`,
      this.setOptions())
      .map((response) => response.json());
  }

  public check(promocode: string) {
    return this.http.put(`${baseUrl}promocode/check`,
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
