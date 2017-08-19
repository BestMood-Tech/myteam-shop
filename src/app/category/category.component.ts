import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksService } from '../shared/services/books.service';
import { MoviesService } from '../shared/services/movies.service';
import { GamesService } from '../shared/services/games.service';
import { Cart } from '../shared/services/cart.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  public products;
  private currentService;

  constructor(private route: ActivatedRoute,
              private movieService: MoviesService,
              private gamesService: GamesService,
              private booksService: BooksService,
              private cart: Cart) {
    switch (this.route.snapshot.url[1].path) {
      case 'books':
        this.currentService = this.booksService;
        break;
      case 'movies':
        this.currentService = this.movieService;
        break;
      default:
        this.currentService = this.gamesService;
        break;
    }
  }

  public ngOnInit() {
    this.products = this.route.snapshot.data['category'];
  }
}
