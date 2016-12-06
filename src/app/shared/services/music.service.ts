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
    return results.map(function(album){
      return {
        id: album.id,
        type: 'music',
        name: album.name,
        cover: album.images[1].url,
        description: album.artists[0].name,
        price: 10
      };
    });
  }

  processItem(album) {
    return {
      id: album.id,
      type: 'music',
      name: album.name,
      cover: album.images[0].url,
      description: album.artists,
      genres: album.genres,
      tracks: album.tracks,
      label: album.label,
      release_date: album.release_date,
      price: 10
    };
  }
}
