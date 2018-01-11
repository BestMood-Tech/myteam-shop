import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { baseUrl, setOptions } from '../helper';
import { Order } from '../models';

@Injectable()
export class OrderService {
  private data: Order[] = [];
  private isLoading: boolean;

  constructor(private httpClient: HttpClient) {
  }

  public create(order: Order): Observable<Order> {
    return this.httpClient.post(`${baseUrl}api/order`, order, setOptions())
      .map((data) => {
        const newOrder = new Order(data);
        this.data.push(newOrder);
        return newOrder;
      });
  }

  public getByProfile(id: string): Observable<Order[]> {
    if ((!this.data || !this.data.length) && !this.isLoading) {
      this.isLoading = true;
      return this.httpClient.get(`${baseUrl}api/order/getByProfileId/${id}`, setOptions())
        .map((data: any[]) => {
          this.data = data.map((item) => new Order(item));
          this.isLoading = false;
          return this.data;
        });
    }
    return Observable.of(this.data);
  }

  public getById(id: string): Observable<Order> {
    if (this.data && this.data.length) {
      const found = this.data.find((item) => item.id === id);
      if (found) {
        return Observable.of(found);
      }
    }
    return this.httpClient.get(`${baseUrl}api/order/getById/${id}`, setOptions())
      .map((data) => new Order(data));
  }

  public get count() {
    return this.data ? this.data.length : 0;
  }
}
