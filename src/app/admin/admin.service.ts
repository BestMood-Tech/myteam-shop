import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AdminService {


  constructor(private _http: Http) {
  }

  getSelling() {
    return this._http.get('/api/selling')
      .map(res => res.json());
  }

}
