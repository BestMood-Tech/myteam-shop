import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MusicService {

  private baseUrl = 'https://api.spotify.com/v1/';

  constructor(private _http: Http) {
  }


  getItem(id) {
    let params: URLSearchParams = new URLSearchParams;
    let getItemUrl = `${this.baseUrl}albums/${id}`;

    let options = new RequestOptions({
      search: params
    });

    return this._http.get(getItemUrl, options)
      .map(res => res.json());
  }

  search(query, filters) {
    let params: URLSearchParams = new URLSearchParams;
    let getItemUrl = `${this.baseUrl}search`;

    for (let value of Object.keys(filters)) {
      query += ' ' + value + ':' + filters[value];
    }

    params.set('q', query);
    params.set('type', 'album');

    let options = new RequestOptions({
      search: params
    });

    return this._http.get(getItemUrl, options)
      .map(res => res.json());
  }

  latest() {
    return this.search('', {tag: 'new'});
  }

  processData(data) {
    let results = data.albums.items;
    let resultingData = results.map(function(album){
      let _tempObject = {};
      _tempObject['id'] = album.id;
      _tempObject['type'] = 'music';
      _tempObject['name'] = album.name;
      // noinspection TypeScriptUnresolvedVariable
      _tempObject['cover'] = album.images[1].url;
      _tempObject['description'] = album.artists[0].name;
      _tempObject['price'] = 10;
      return _tempObject;
    });
    return resultingData;
  }

  processItem(album) {
    console.log(album);
      let _tempObject = {};
      _tempObject['id'] = album.id;
      _tempObject['type'] = 'music';
      _tempObject['name'] = album.name;
      // noinspection TypeScriptUnresolvedVariable
      _tempObject['cover'] = album.images[0].url;
      _tempObject['description'] = album.artists;
      _tempObject['genres'] = album.genres;
      _tempObject['tracks'] = album.tracks;
      _tempObject['label'] = album.label;
      _tempObject['release_date'] = album.release_date;
    return _tempObject;
  }
}
