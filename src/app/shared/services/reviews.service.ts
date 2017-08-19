import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
<<<<<<< HEAD
import { Review } from '../models/review.model';
import { baseUrl } from '../helper';
=======
import { Review } from '../review.model';
import { baseUrl, setOptions } from '../helper';
>>>>>>> eb130be572bd649ddc7916375eeaf715e2c56b4b

@Injectable()
export class ReviewsService {
  private reviewsURL = `${baseUrl}api/review`;
  constructor(private http: Http) {
  }

  public add(data: Review) {
    return this.http.post(`${this.reviewsURL}`, data, setOptions()).map((res) => res.json());
  }

  public get(id) {
    return this.http.get(`${this.reviewsURL}/${id}`).map((res) => res.json().result);
  }
}
