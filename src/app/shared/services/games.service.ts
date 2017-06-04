import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class GamesService {

  private baseUrl = 'https://igdbcom-internet-game-database-v1.p.mashape.com/';
  private xMashapeKey = 'mOOXc4tX8Pmsh0FpTzd1KwlWjSHhp1MuPfXjsnCJsAUgGEcL9O';

  constructor(private http: Http) {
  }

  private getParams(): URLSearchParams {
    let params = new URLSearchParams();
    params.set('fields', '*');
    return params;
  }

  private getHeaders(): Headers {
    let headers = new Headers();
    headers.set('X-Mashape-Key', this.xMashapeKey);
    headers.set('Accept', 'application/json');
    return headers;
  }

  public getItem(id) {
    let getItemUrl = `${this.baseUrl}games/${id}`;

    let options = new RequestOptions({
      search: this.getParams(),
      headers: this.getHeaders()
    });

    return this.http.get(getItemUrl, options).map(res => res.json());
  }

  public getDevelopers(ids) {
    if (!ids) return Observable.from(['']);
    let idString = ids.join();
    let getDeveloperUrl = `${this.baseUrl}companies/${idString}`;
    let params = this.getParams();
    params.set('fields', 'name');

    let options = new RequestOptions({
      search: params,
      headers: this.getHeaders()
    });

    return this.http.get(getDeveloperUrl, options).map(res => res.json());
  }

  public getGenres(ids) {
    if (!ids) return Observable.from(['']);
    let idString = ids.join();
    let getGenreUrl = `${this.baseUrl}genres/${idString}`;
    let params = this.getParams();
    params.set('fields', 'name');

    let options = new RequestOptions({
      search: params,
      headers: this.getHeaders()
    });

    return this.http.get(getGenreUrl, options).map(res => res.json());
  }

  public search(query, filters?) {
    let getItemUrl = `${this.baseUrl}games/`;
    let params = this.getParams();
    let limit;
    params.set(`search`, query);
    if(filters) {
      for (let value of Object.keys(filters)) {
        if (value === 'limit') limit = filters[value];
        else params.set(`filter[${value}][eq]`, filters[value]);
      }
    }

    if (limit) params.set('limit', limit);

    let options = new RequestOptions({
      search: params,
      headers: this.getHeaders()
    });

    return this.http.get(getItemUrl, options).map(res => res.json());
  }

  public latest() {
    let getItemUrl = `${this.baseUrl}games/`;
    let params = this.getParams();
    params.set('order', 'release_dates.date:desc');
    params.set('limit', '18');
    let options = new RequestOptions({
      search: params,
      headers: this.getHeaders()
    });

    return this.http.get(getItemUrl, options).map(res => res.json());
  }

  public processData(data) {
    return data.map(function(game){
      let tempObject = {
        id: game.id,
        type: 'game',
        name: game.name,
        price: Math.floor(game.popularity * 100) / 10
      };

      if (game.cover) {
        tempObject['cover'] = `https://images.igdb.com/igdb/image/upload/t_logo_med/${game.cover.cloudinary_id}.jpg`;
      } else tempObject['cover'] = 'http://placehold.it/320x150';

      if (game.summary) tempObject['description'] = game.summary;
      else tempObject['description'] = "this game hasn't description yet.";

      return tempObject;
    });
  }

  public processItem(data) {
    let resultingData = data.map(function(game){
      let tempObject = {
        id: game.id,
        type: 'game',
        name: game.name,
        genres: game.genres,
        developers: game.developers,
        release_date: new Date(game.first_release_date).toDateString(),
        price: Math.floor(game.popularity * 100) / 10
      };
      if (game.cover) {
        tempObject['cover'] = `https://images.igdb.com/igdb/image/upload/t_screenshot_med_2x/${game.cover.cloudinary_id}.jpg`;
      } else tempObject['cover'] = 'http://placehold.it/320x150';

      if (game.summary) tempObject['description'] = game.summary;
      else tempObject['description'] = "this game hasn't description yet.";

      return tempObject;
    });

    return resultingData[0];
  }
}
