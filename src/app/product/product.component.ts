import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { ToastsManager } from 'ng2-toastr';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { Profile } from '../shared/models/profile.model';
import { VideoModalWindowComponent } from '../shared/components/video-modal-window/video.component';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { Review } from '../shared/models/review.model';
import { ReviewsService } from './reviews.service';
import { AuthService, BooksService, CartService, GamesService, MoviesService } from '../shared/services';
import { GameStatuses, Product } from '../shared/models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: 'product.component.html',
  styleUrls: ['product.component.scss'],
  providers: [ReviewsService]
})
export class ProductComponent implements OnInit {
  public product: Product;
  public productCurrency = '$';
  public recommended: Product[];
  public view = 'info';
  public reviews: Review[] = [];
  public user: Profile = null;
  private currentService;
  private type: string;
  private id: string;

  constructor(private route: ActivatedRoute,
              private booksService: BooksService,
              private movieService: MoviesService,
              private gamesService: GamesService,
              private cartService: CartService,
              private authService: AuthService,
              private modalService: NgbModal,
              private reviewsService: ReviewsService,
              private toastsManager: ToastsManager) {
  }

  public ngOnInit() {
    this.route.params
      .mergeMap((params: { type: string, id: string }) => {
        this.type = params.type;
        this.id = params.id;
        switch (this.type) {
          case 'book':
            this.currentService = this.booksService;
            break;
          case 'movie':
            this.currentService = this.movieService;
            break;
          default:
            this.currentService = this.gamesService;
        }
        return this.currentService.getItem(this.id);
      })
      .mergeMap((product: Product) => {
        this.product = product;
        this.product.coverUrl = this.product.cover;

        const observables = [];
        observables.push(this.currentService.getRecommended(this.id));
        observables.push(this.reviewsService.get(`${this.type}${this.id}`));
        if (this.type === 'game') {
          observables.push(this.currentService.getGenres(this.product.genres));
          observables.push(this.currentService.getDevelopers(this.product.developers));
        }
        if (this.type === 'movie') {
          observables.push(this.currentService.getCredits(this.id));
        }
        return Observable.forkJoin(observables)
      })
      .subscribe(([recommended, reviews, ...data]: any[]) => {
        this.recommended = recommended;
        this.recommended.forEach((item) => item.coverUrl = item.cover);
        this.reviews = reviews;
        if (this.type === 'game') {
          this.product.genres = data[0];
          this.product.developers = data[1]
        }
        if (this.type === 'movie') {
          this.product.credits = data[0];
        }
      });

    this.authService.profile.subscribe((user: Profile) => {
      if (!user) {
        return;
      }
      this.productCurrency = user.currency;
      this.user = user;
    });
    this.authService.get();
  }

  public addToCart(product: Product): void {
    this.cartService.add(product);
  }

  public showTrailer(item: Product): void {
    const modalRef = this.modalService.open(VideoModalWindowComponent);
    modalRef.componentInstance.product = item;
    modalRef.result.then((resolve) => null, (error) => null);
  }

  public imgError(product: Product): void {
    product.coverUrl = `../../assets/${product.type}.png`;
  }

  public getStatusGame(): string {
    return GameStatuses.find((item) => item.status === this.product.status).value
  }

  public setView(type: string): void {
    this.view = type;
  }

  public newReview(): void {
    const modalRef = this.modalService.open(ReviewFormComponent);
    modalRef.result
      .then(
        (resolve) => {
          const bufferReview = new Review({
            text: resolve.text,
            rate: resolve.rate,
            username: this.user ? this.user.fullName : 'No name',
            productID: `${this.type}${this.id}`,
            createDate: new Date()
          });
          this.reviewsService.add(bufferReview).toPromise()
            .then((review: Review) => {
              this.reviews.unshift(review);
              this.toastsManager.success('Review is added', 'Success!')
            });
        },
        (error) => null
      )
  }
}
