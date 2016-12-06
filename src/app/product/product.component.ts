import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from '../shared/services/music.service';
import { MovieService } from '../shared/services/movie.service';
import { GamesService } from '../shared/services/games.service';
import { Cart } from '../shared/services/cart.service';
import { Auth } from '../shared/services/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  private currentService;

  product;
  public productCurrency: any;

  constructor ( private route: ActivatedRoute,
                private _musicService: MusicService,
                private _movieService: MovieService,
                private _gamesService: GamesService,
                private _cart: Cart,
                private _auth: Auth) {
    switch (this.route.snapshot.url[1].path) {
      case 'music': this.currentService = this._musicService; break;
      case 'movie': this.currentService = this._movieService; break;
      default: this.currentService = this._gamesService; break;
    }
  }

  ngOnInit() {
    this.product = this.currentService.processItem(this.route.snapshot.data['product']);

    if (this.route.snapshot.url[1].path === 'game') {
      this.currentService.getGenres(this.product.genres)
        .subscribe(res => this.product.genres = res);

      this.currentService.getDevelopers(this.product.developers)
        .subscribe(res => this.product.developers = res);
    }

    if(this._auth.user == null) this.productCurrency = "$";
    else this.productCurrency = this._auth.user.currency;
  }

  addToCart(product) {
    this._cart.addToCart(product);
  }
}
