import {Injectable} from '@angular/core';
import {Http, URLSearchParams, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AdminService {

  constructor(private http: Http) {
  }

  public getSelling(fromYear?, toYear?) {
    const params = new URLSearchParams();
    params.set('from', fromYear);
    params.set('to', toYear);

    return this.http.get('/api/selling', new RequestOptions({search: params}))
      .map(res => res.json());
  }

}
