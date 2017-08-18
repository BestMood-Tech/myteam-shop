import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { GamesService } from '../shared/services/games.service';
import { MovieService } from '../shared/services/movie.service';
import { BooksService } from '../shared/services/books.service';


@Injectable()
export class CategoryResolve implements Resolve<any> {

  constructor(private movieService: MovieService,
              private gamesService: GamesService,
              private booksService: BooksService) {
  }

  public resolve(route: ActivatedRouteSnapshot) {
    switch (route.url[1].path) {
      case 'movies':
        return this.movieService.recent();
      case 'books':
        return this.booksService.getItems();
      default:
        return this.gamesService.latest();
    }
  }
}
