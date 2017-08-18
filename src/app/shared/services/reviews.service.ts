import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Review } from '../models/review.model';
import { baseUrl } from '../helper';

@Injectable()
export class ReviewsService {
  private reviewsURL = `${baseUrl}api/review`;
  constructor(private http: Http) {
  }

  public add(data: Review) {
    return this.http.post(`${this.reviewsURL}`, data).map((res) => res.json());
  }

  public get(id) {
    return this.http.get(`${this.reviewsURL}/${id}`).map((res) => res.json().result);
  }
}
