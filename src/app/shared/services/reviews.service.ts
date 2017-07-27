import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Review } from '../review.model';

@Injectable()
export class ReviewsService {
  private baseURL = 'https://cvoslanrki.execute-api.eu-central-1.amazonaws.com/dev/reviews';
  constructor(private http: Http) {
  }

  public add(data: Review) {
    return this.http.post(`${this.baseURL}/add`, data).map((res) => res.json());
  }

  public get(id) {
    return this.http.get(`${this.baseURL}/${id}`).map((res) => res.json().data);
  }
}
