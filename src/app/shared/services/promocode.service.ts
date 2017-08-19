import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { baseUrl, setOptions } from '../helper';
import { Observable } from 'rxjs/Observable';
import { Promocode } from '../models/promocode.model';

interface Percent {
  percent: number;
}

@Injectable()
export class PromocodeService {
  constructor(private http: Http) {
  }

  public create(id: string, isNewUser: boolean, orderCount?: number): Observable<Percent> {
    return this.http.post(`${baseUrl}api/promocode/${id}`,
      { isNewUser, orderCount }, setOptions())
      .map((response) => response.json());
  }

  public get(id: string): Observable<Promocode> {
    return this.http.get(`${baseUrl}api/promocode/${id}`, setOptions())
      .map((response) => response.json())
      .map((data) => new Promocode(data));
  }

  public check(id: string, promocode: string): Observable<Percent> {
    return this.http.put(`${baseUrl}api/promocode/${id}`, { promocode }, setOptions())
      .map((response) => response.json());
  }

  public remove(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}api/promocode/${id}`, setOptions())
      .map((response) => response.json());
  }
}
