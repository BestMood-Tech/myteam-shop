import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { BooksService, GamesService, MoviesService } from '../shared/services';

@Injectable()
export class CategoryResolve implements Resolve<any> {

  constructor(private movieService: MoviesService,
              private gamesService: GamesService,
              private booksService: BooksService) {
  }

  public resolve(route: ActivatedRouteSnapshot) {
    switch (route.url[1].path) {
      case 'movies':
        return this.movieService.getItems();
      case 'books':
        return this.booksService.getItems();
      default:
        return this.gamesService.getItems();
    }
  }
}
