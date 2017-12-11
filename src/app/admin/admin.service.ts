import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/map';

import { baseUrl } from '../shared/helper';

@Injectable()
export class AdminService {

  constructor(private http: Http) {
  }

  public getSelling(fromYear?, toYear?) {
    const params = new URLSearchParams();
    params.set('from', fromYear);
    params.set('to', toYear);
    params.set('isFake', 'true');

    return this.http.get(`${baseUrl}api/order/getByRangeDates`, new RequestOptions({ search: params }))
      .map(res => res.json());
  }

}
