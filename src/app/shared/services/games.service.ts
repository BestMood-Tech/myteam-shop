import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

@Injectable()
export class GamesService {
  public data: any[];
  private baseUrl = 'https://igdbcom-internet-game-database-v1.p.mashape.com/';
  private xMashapeKey = 'mOOXc4tX8Pmsh0FpTzd1KwlWjSHhp1MuPfXjsnCJsAUgGEcL9O';

  constructor(private http: Http) {
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    params.set('fields', '*');
    return params;
  }

  private getHeaders(): Headers {
    const headers = new Headers();
    headers.set('X-Mashape-Key', this.xMashapeKey);
    headers.set('Accept', 'application/json');
    return headers;
  }

  public getItem(id) {
    const getItemUrl = `${this.baseUrl}games/${id}`;

    const options = new RequestOptions({
      search: this.getParams(),
      headers: this.getHeaders()
    });

    return this.http.get(getItemUrl, options)
      .map(res => res.json());
  }

  public getDevelopers(ids) {
    if (!ids) {
      return Observable.from(['']);
    }
    const idString = ids.join();
    const getDeveloperUrl = `${this.baseUrl}companies/${idString}`;
    const params = this.getParams();
    params.set('fields', 'name');

    const options = new RequestOptions({
      search: params,
      headers: this.getHeaders()
    });

    return this.http.get(getDeveloperUrl, options).map(res => res.json());
  }

  public getGenres(ids) {
    if (!ids) {
      return Observable.from(['']);
    }
    const idString = ids.join();
    const getGenreUrl = `${this.baseUrl}genres/${idString}`;
    const params = this.getParams();
    params.set('fields', 'name');

    const options = new RequestOptions({
      search: params,
      headers: this.getHeaders()
    });

    return this.http.get(getGenreUrl, options)
      .map(res => res.json());
  }

  public getAllGenres() {
    const options = new RequestOptions({
      headers: this.getHeaders()
    });
    return this.http.get(`${this.baseUrl}genres/`, options).map(res => res.json());
  }

  public search(query, filters?) {
    const getItemUrl = `${this.baseUrl}games/`;
    const params = this.getParams();
    let limit;
    params.set(`search`, query);
    if (filters) {
      for (const value of Object.keys(filters)) {
        if (value === 'limit') {
          limit = filters[value];
        } else {
          params.set(`filter[${value}][eq]`, filters[value]);
        }
      }
    }

    if (limit) {
      params.set('limit', limit);
    }

    const options = new RequestOptions({
      search: params,
      headers: this.getHeaders()
    });

    return this.http.get(getItemUrl, options).map(res => res.json());
  }

  public latest() {
    const getItemUrl = `${this.baseUrl}games/`;
    const params = this.getParams();
    params.set('order', 'popularity:desc');
    params.set('limit', '20');
    const options = new RequestOptions({
      search: params,
      headers: this.getHeaders()
    });

    return this.http.get(getItemUrl, options).map(res => res.json());
  }

  public processData(data) {
    this.data = data.map((game) => {
      const tempObject = {
        id: game.id,
        type: 'game',
        name: game.name,
        price: Math.floor(game.popularity / 10),
        year: moment(game.first_release_date).format('YYYY'),
        vote: game.popularity % 5 === 0 ? 5 : game.popularity % 5 < 2 ? game.popularity % 5 + 2 : game.popularity % 5,
        voteCount: game.collection,
        trailer: game.videos ? game.videos[0].video_id : ''
      };

      if (game.cover) {
        tempObject['cover'] = `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${game.cover.cloudinary_id}.jpg`;
      } else {
        tempObject['cover'] = 'http://placehold.it/320x150';
      }

      if (game.summary) {
        tempObject['description'] = game.summary;
      } else {
        tempObject['description'] = `this game hasn't description yet.`;
      }

      return tempObject;
    });
    return this.data;
  }

  public getRecommended(game) {
    return this.data.filter((item) => item.id !== game.id);
  }

  public processItem(data) {
    console.log(data);
    const resultingData = data.map((game) => {
      const tempObject = {
        id: game.id,
        type: 'game',
        name: game.name,
        genres: game.genres,
        developers: game.developers,
        release_date: moment(game.first_release_date).format('YYYY'),
        price: Math.floor(game.popularity / 10),
        vote: game.popularity % 5 === 0 ? 5 : game.popularity % 5 < 2 ? game.popularity % 5 + 2 : game.popularity % 5,
        trailer: game.videos ? game.videos[0].video_id : '',
        websites: game.websites
      };
      if (game.cover) {
        tempObject['cover'] = `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${game.cover.cloudinary_id}.jpg`;
      } else {
        tempObject['cover'] = 'http://placehold.it/320x150';
      }

      if (game.summary) {
        tempObject['description'] = game.summary;
      } else {
        tempObject['description'] = `this game hasn't description yet.`;
      }

      return tempObject;
    });

    return resultingData[0];
  }

}
