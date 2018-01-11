import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Product } from '../shared/models';
import { BooksService, GamesService, MoviesService } from '../shared/services';

@Component({
  selector: 'app-category',
  templateUrl: 'category.component.html',
  styleUrls: ['category.component.scss']
})
export class CategoryComponent implements OnInit {
  public products: Product[];
  private currentService: any;

  constructor(private route: ActivatedRoute,
              private movieService: MoviesService,
              private gamesService: GamesService,
              private booksService: BooksService) {
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
