import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { User } from '../shared/user.model';
import { VideoModalWindowComponent } from '../shared/components/video-modal-window/video.component';
import { Auth, BooksService, Cart, GamesService, MovieService } from '../shared/services';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  public product;
  public productCurrency: any;
  public recommended: any[];
  private currentService;

  constructor(private route: ActivatedRoute,
              private booksService: BooksService,
              private movieService: MovieService,
              private gamesService: GamesService,
              private cart: Cart,
              private auth: Auth,
              private modalService: NgbModal) {
    switch (this.route.snapshot.url[1].path) {
      case 'book':
        this.currentService = this.booksService;
        break;
      case 'movie':
        this.currentService = this.movieService;
        break;
      default:
        this.currentService = this.gamesService;
        break;
    }
  }

  public ngOnInit() {
    this.route.params.subscribe(() => {
      this.product = this.currentService.processItem(this.route.snapshot.data['product']);
      this.product.coverUrl = this.product.cover;
      if (!this.currentService.data || this.currentService.data.length === 0) {
        let getData;
        switch (this.product.type) {
          case 'movie':
            getData = this.movieService.recent();
            break;
          case 'book':
            getData = this.booksService.getStories();
            break;
          default:
            getData = this.gamesService.latest();
        }
        getData.subscribe((data) => {
          this.currentService.processData(data);
          this.recommended = this.currentService.getRecommended(this.product);
          this.recommended.forEach((item) => item.coverUrl = item.cover);
        });
      } else {
        this.recommended = this.currentService.getRecommended(this.product);
        this.recommended.forEach((item) => item.coverUrl = item.cover);
      }
      if (this.route.snapshot.url[1].path === 'game') {
        this.currentService.getGenres(this.product.genres)
          .subscribe(res => this.product.genres = res);

        this.currentService.getDevelopers(this.product.developers)
          .subscribe(res => this.product.developers = res);
      }
      this.auth.onAuth.subscribe((user: User) => {
        if (!user) {
          this.productCurrency = '$';
          return;
        }
        this.productCurrency = user.currency;
      });
      this.auth.getProfile();

      if (this.product.type === 'movie') {
        this.currentService.getCredits(this.product.id)
          .subscribe((data) => this.product['credits'] = data.slice(0, 4));
      }
    });
  }

  public addToCart(product) {
    this.cart.addToCart(product);
  }

  public showTrailer(item) {
    const modalRef = this.modalService.open(VideoModalWindowComponent);
    modalRef.componentInstance.product = item;
    modalRef.result.then((resolve) => null, (error) => null);
  }

  public imgError(product) {
    product.coverUrl = `../../assets/${product.type}.png`;
  }

  public getStatusGame() {
    const status = [
      {status: 0, value: 'Main game'},
      {status: 1, value: 'DLC / Addon'},
      {status: 2, value: 'Expansion'},
      {status: 3, value: 'Bundle'},
      {status: 4, value: 'Standalone expansion'}
    ];
    return status.find((item) => item.status === this.product.status).value
  }
}
