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

  products;

  private currentService;

  constructor ( private route: ActivatedRoute,
              private _musicService: MusicService,
              private  _movieService: MovieService,
              private _gamesService: GamesService,
              private _cart: Cart) {
    switch (this.route.snapshot.url[1].path) {
      case 'music': this.currentService = this._musicService; break;
      case 'movies': this.currentService = this._movieService; break;
      default: this.currentService = this._gamesService; break;
    }
  }

  ngOnInit() {
    this.products = this.currentService.processData(this.route.snapshot.data['category']);
  }

  addToCart(product) {
    this._cart.addToCart(product);
  }


}
