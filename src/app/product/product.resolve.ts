import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { GamesService } from '../shared/services/games.service';
import { MoviesService } from '../shared/services/movies.service';
import { BooksService } from '../shared/services/books.service';

@Injectable()
export class ProductResolve implements Resolve<any> {

  constructor(private gamesService: GamesService,
              private movieService: MoviesService,
              private bookService: BooksService) {
  }

  public resolve(route: ActivatedRouteSnapshot) {
    switch (route.params['type']) {
      case 'movie':
        return this.movieService.getItem(route.params['id']);
      case 'book':
        return this.bookService.getItem(route.params['id']);
      default:
        return this.gamesService.getItem(route.params['id']);
    }
  }
}
