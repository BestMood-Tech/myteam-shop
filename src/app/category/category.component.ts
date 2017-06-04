import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from '../shared/services/music.service';
import { MovieService } from '../shared/services/movie.service';
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

  constructor ( private route: ActivatedRoute,
              private movieService: MovieService,
              private gamesService: GamesService,
              private cart: Cart) {
    switch (this.route.snapshot.url[1].path) {
      case 'movies': this.currentService = this.movieService; break;
      default: this.currentService = this.gamesService; break;
    }
  }

  public ngOnInit() {
    this.products = this.currentService.processData(this.route.snapshot.data['category']);
  }

  public addToCart(product) {
    this.cart.addToCart(product);
  }
}
