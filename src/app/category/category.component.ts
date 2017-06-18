import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksService } from '../shared/services/books.service';
import { MovieService } from '../shared/services/movie.service';
import { GamesService } from '../shared/services/games.service';
import { Cart } from '../shared/services/cart.service';
import dragscroll from 'dragscroll';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  public products;
  private currentService;

  constructor(private route: ActivatedRoute,
              private movieService: MovieService,
              private gamesService: GamesService,
              private booksService: BooksService,
              private cart: Cart) {
    switch (this.route.snapshot.url[1].path) {
      case 'books': this.currentService = this.booksService; break;
      case 'movies': this.currentService = this.movieService; break;
      default: this.currentService = this.gamesService; break;
    }
  }

  public ngOnInit() {
    dragscroll.reset();
    this.products = this.currentService.processData(this.route.snapshot.data['category']);
  }

  public addToCart(product) {
    this.cart.addToCart(product);
  }
}
