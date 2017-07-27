import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { User } from '../shared/user.model';
import { VideoModalWindowComponent } from '../shared/components/video-modal-window/video.component';
import { ReviewFormComponent } from '../shared/components/review-form/review-form.component';
import { Review } from '../shared/review.model';
import { ReviewsService } from '../shared/services/reviews.service';
import { ToastsManager } from 'ng2-toastr';
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
  public view = 'info';
  public reviews: Review[] = [];
  public user = null;
  private currentService;

  constructor(private route: ActivatedRoute,
              private booksService: BooksService,
              private movieService: MovieService,
              private gamesService: GamesService,
              private cart: Cart,
              private auth: Auth,
              private modalService: NgbModal,
              private reviewsService: ReviewsService,
              private toastr: ToastsManager) {
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
        this.user = user;
      });
      this.auth.getProfile();

      if (this.product.type === 'movie') {
        this.currentService.getCredits(this.product.id)
          .subscribe((data) => this.product['credits'] = data.slice(0, 4));
      }
    });

    this.reviewsService.get(`${this.route.snapshot.url[1].path}${this.route.snapshot.url[2].path}`)
      .subscribe((res) => this.reviews = res)

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

  public setView(type) {
    this.view = type;
  }

  public newReview() {
    const modalRef = this.modalService.open(ReviewFormComponent);
    modalRef.result.then(
      (resolve) => {
        const bufferReview = new Review({
          text: resolve.text,
          rate: resolve.rate,
          username: this.user ? this.user.nickName : 'No name',
          productID: `${this.route.snapshot.url[1].path}${this.route.snapshot.url[2].path}`,
          createDate: new Date()
        });
        this.reviewsService.add(bufferReview)
          .subscribe(() => {
            this.reviews.unshift(bufferReview);
            this.toastr.success('Review added', 'Success')
          });
      },
      (error) => null
    );
  }
}
