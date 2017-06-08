import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksService } from '../shared/services/books.service';
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
                private booksService: BooksService,
                private movieService: MovieService,
                private gamesService: GamesService,
                private cart: Cart,
                private auth: Auth) {
    switch (this.route.snapshot.url[1].path) {
      case 'books': this.currentService = this.booksService; break;
      case 'movie': this.currentService = this.movieService; break;
      default: this.currentService = this.gamesService; break;
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

    if(this.auth.user == null) this.productCurrency = "$";
    else this.productCurrency = this.auth.user.currency;
  }

  addToCart(product) {
    this.cart.addToCart(product);
  }
}
