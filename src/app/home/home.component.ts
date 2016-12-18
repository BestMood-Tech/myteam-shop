import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from '../shared/services/music.service';
import { MovieService } from '../shared/services/movie.service';
import { GamesService } from '../shared/services/games.service';
import { Cart } from '../shared/services/cart.service';
import { Auth } from '../shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public musicData: any;
  public gameData: any;
  public movieData: any;
  public productCurrency: any;
  constructor(private route: ActivatedRoute,
              private musicService: MusicService,
              private movieService: MovieService,
              private gamesService: GamesService,
              private cart: Cart,
              private auth: Auth) {}

  ngOnInit() {
    this.musicService.latest().subscribe(res => {
      this.musicData = this.musicService.processData(res).slice(0, 12);
      console.log(this.musicData);
    });
    this.gamesService.latest().subscribe(res => {
      this.gameData = this.gamesService.processData(res).slice(0, 12);
      console.log(this.gameData);
    });
    this.movieService.recent().subscribe(res => {
      this.movieData = this.movieService.processData(res).slice(0, 12);
      console.log(this.movieData);
    });
    if  (this.auth.user == null) {
      this.productCurrency = '$';
    } else {
      this.productCurrency = this.auth.user.currency;
    }
  }

  public addToCart(product) {
    this.cart.addToCart(product);
  }

}
