import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { baseUrl, setOptions } from '../helper';

@Injectable()
export class PromocodeService {
  constructor(private http: Http) {
  }

  public create(isNewUser: boolean, orderCount?: number) {
    return this.http.put(`${baseUrl}promocode/create`,
      { isNewUser, orderCount }, setOptions())
      .map((response) => response.json());
  }

  public get() {
    return this.http.get(`${baseUrl}promocode/get`,
      setOptions())
      .map((response) => response.json());
  }

  public check(promocode: string) {
    return this.http.put(`${baseUrl}promocode/check`,
      { promocode }, setOptions())
      .map((response) => response.json());
  }
}
