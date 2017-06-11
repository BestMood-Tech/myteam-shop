import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { GamesService } from '../shared/services/games.service';
import { MovieService } from '../shared/services/movie.service';
import { BooksService } from '../shared/services/books.service';

@Injectable()
export class ProductResolve implements Resolve<any> {

  constructor (private gamesService: GamesService,
               private movieService: MovieService,
               private bookService: BooksService) {}

  public resolve(route: ActivatedRouteSnapshot) {
    switch (route.params['type']) {
      case 'movie': return this.movieService.getItem(route.params['id']);
      case 'books': return this.bookService.getItem(route.params['id']);
      default: return this.gamesService.getItem(route.params['id']);
    }
  }
}
