import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { GamesService } from '../shared/services/games.service';
import { MovieService } from '../shared/services/movie.service';
import { MusicService } from '../shared/services/music.service';


@Injectable()
export class CategoryResolve implements Resolve<any> {

  constructor ( private _musicService: MusicService,
                private _movieService: MovieService,
                private _gamesService: GamesService) {}
  public resolve(route: ActivatedRouteSnapshot) {
    if (route.url[1].path === 'music') { return this._musicService.latest(); }
    if (route.url[1].path === 'movies') { return this._movieService.recent(); }
    return this._gamesService.latest();
  }
}
