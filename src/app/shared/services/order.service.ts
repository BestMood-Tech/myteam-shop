import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { baseUrl, setOptions } from '../helper';

@Injectable()
export class OrderService {
  constructor(private http: Http) {
  }

  public createOrder(orderData) {
    return this.http.post(`${baseUrl}api/order`, orderData, setOptions())
      .map((res) => res.json());
  }

  public getOrdersByProfile(id) {
    return this.http.get(`${baseUrl}api/order/getByProfileId/${id}`, setOptions())
      .map((res) => res.json())
      .map(orders => {
        return orders.map(order => {
          order.createdAt = new Date(order.createdAt);
          return order;
        })
      });
  }

  public getOrderById(id) {
    return this.http.get(`${baseUrl}api/order/getById/${id}`, setOptions())
      .map((res) => res.json());
  }

  public getOrderCount() {
    // return this.user.orders.length;
  }
}
