import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { GamesService } from '../shared/services/games.service';
import { MovieService } from '../shared/services/movie.service';

@Injectable()
export class ProductResolve implements Resolve<any> {

  constructor (private gamesService: GamesService,
               private movieService: MovieService) {}

  public resolve(route: ActivatedRouteSnapshot) {
    if (route.params['type'] === 'movie') { return this.movieService.getItem(route.params['id']); }
    return this.gamesService.getItem(route.params['id']);
  }
}
