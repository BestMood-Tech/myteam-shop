import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class PromocodeService {
  constructor(private http: Http) {
  }

  public create(id: string, social: string, isNewUser?: boolean, orderCount?: number) {
    return this.http.put('https://m81j11ueq7.execute-api.eu-central-1.amazonaws.com/dev/promocode/create',
      { id, social, isNewUser, orderCount })
  }
}
