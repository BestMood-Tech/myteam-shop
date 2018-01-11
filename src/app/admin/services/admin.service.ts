import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { baseUrl } from '../../shared/helper';
import { Order } from '../../shared/models';

@Injectable()
export class AdminService {

  constructor(private httpClient: HttpClient) {
  }

  public getSelling(fromYear?: string, toYear?: string, isFake = true): Observable<Order[]> {
    let params = new HttpParams()
      .set('isFake', isFake.toString());
    if (fromYear && toYear) {
      params = params
        .set('from', fromYear)
        .set('to', toYear);
    }

    return this.httpClient.get<Order[]>(`${baseUrl}api/order/getByRangeDates`, { params })
      .map((orders: Order[]) => orders ? orders.map((order: Order) => new Order(order)) : []);
  }

}
