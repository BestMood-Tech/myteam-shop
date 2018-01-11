import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { baseUrl, setOptions } from '../helper';
import { Promocode } from '../models';
import { ToastsManager } from 'ng2-toastr';

export interface Percent {
  percent: number;
}

@Injectable()
export class PromocodeService {
  constructor(private httpClient: HttpClient) {
  }

  public create(id: string, isNewUser: boolean, orderCount?: number): Observable<Percent> {
    return this.httpClient.post<Percent>(`${baseUrl}api/promocode/${id}`,
      { isNewUser, orderCount }, setOptions());
  }

  public get(id: string): Observable<Promocode> {
    return this.httpClient.get(`${baseUrl}api/promocode/${id}`, setOptions())
      .map((data) => new Promocode(data));
  }

  public check(id: string, promocode: string): Observable<Percent> {
    return this.httpClient.put<Percent>(`${baseUrl}api/promocode/${id}`, { promocode }, setOptions());
  }

  public remove(id: string): Observable<string> {
    return this.httpClient.delete<string>(`${baseUrl}api/promocode/${id}`,
      Object.assign(setOptions(), { observe: 'response', responseType: 'text' }));
  }
}
