import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MusicService } from '../shared/services/music.service';
import { GamesService } from '../shared/services/games.service';
import { MovieService } from '../shared/services/movie.service';

@Injectable()
export class ProductResolve implements Resolve<any> {

  constructor ( private _musicService: MusicService,
                private _gamesService: GamesService,
                private _movieService: MovieService) {}

  resolve(route: ActivatedRouteSnapshot) {
    if (route.params['type'] === 'music') { return this._musicService.getItem(route.params['id']); }
    if (route.params['type'] === 'movie') { return this._movieService.getItem(route.params['id']); }
    return this._gamesService.getItem(route.params['id']);
  }
}
