import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { GamesService } from '../shared/services/games.service';
import { MoviesService } from '../shared/services/movies.service';
import { BooksService } from '../shared/services/books.service';


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
