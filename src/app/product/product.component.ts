import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from '../shared/services/music.service';
import { MovieService } from '../shared/services/movie.service';
import { GamesService } from '../shared/services/games.service';
import { Cart } from '../shared/services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  private currentService;

  product;

  constructor ( private route: ActivatedRoute,
                private _musicService: MusicService,
                private _movieService: MovieService,
                private _gamesService: GamesService,
                private _cart: Cart) {
    switch (this.route.snapshot.url[1].path) {
      case 'music': this.currentService = this._musicService; break;
      case 'movie': this.currentService = this._movieService; break;
      default: this.currentService = this._gamesService; break;
    }
  }

  ngOnInit() {
    this.product = this.currentService.processItem(this.route.snapshot.data['product']);
    if (this.route.snapshot.url[1].path === 'game') {
      this.currentService.getGenres(this.product.genres).subscribe(res => this.product.genres = res);
      this.currentService.getDevelopers(this.product.developers).subscribe(res => this.product.developers = res);
    }
    console.log(this.product);
  }

  addToCart(product) {
    this._cart.addToCart(product);
  }
}
