import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Review } from '../shared/models/review.model';
import { baseUrl, setOptions } from '../shared/helper';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ReviewsService {
  constructor(private http: Http) {
  }

  public add(review: Review): Observable<Review> {
    return this.http.post(`${baseUrl}api/review`, review, setOptions())
      .map((response) => response.json())
      .map((data) => new Review(data));
  }

  public get(id: string): Observable<Review[]> {
    return this.http.get(`${baseUrl}api/review/${id}`)
      .map((response) => response.json().result)
      .map((data) => data.map((item) => new Review(item)));
  }
}
