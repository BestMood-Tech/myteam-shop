import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { Review } from '../../shared/models';
import { baseUrl, setOptions } from '../../shared/helper';


@Injectable()
export class ReviewService {
  constructor(private httpClient: HttpClient) {
  }

  public add(review: Review): Observable<Review> {
    return this.httpClient.post(`${baseUrl}api/review`, review, setOptions())
      .map((data) => new Review(data));
  }

  public get(id: string): Observable<Review[]> {
    return this.httpClient.get(`${baseUrl}api/review/${id}`)
      .map((result: any) => result.result)
      .map((data) => data.map((item) => new Review(item)));
  }
}
