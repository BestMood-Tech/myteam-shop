import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

@Injectable()
export class PromocodeService {
  constructor(private http: Http) {
  }

  public create(isNewUser?: boolean, orderCount?: number) {
    return this.http.put('https://m81j11ueq7.execute-api.eu-central-1.amazonaws.com/dev/promocode/create',
      { isNewUser, orderCount }, this.getOptions())
      .map((response) => response.json());
  }

  public get() {
    return this.http.get(`https://m81j11ueq7.execute-api.eu-central-1.amazonaws.com/dev/promocode/get`,
      this.getOptions())
      .map((response) => response.json());
  }

  public check(promocode: string) {
    return this.http.put('https://m81j11ueq7.execute-api.eu-central-1.amazonaws.com/dev/promocode/check',
      { promocode }, this.getOptions())
      .map((response) => response.json());
  }

  private getOptions() {
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
