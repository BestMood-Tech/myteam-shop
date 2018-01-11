import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { Store } from '@ngrx/store';

import { GameStatuses, Product, Profile, Review } from '../../../shared/models';
import { VideoModalWindowComponent } from '../../../shared/components';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { AuthService, BooksService, GamesService, MoviesService } from '../../../shared/services';
import { AppState } from '../../../store/app.state';
import * as CartActions from '../../../store/cart/cart.action';
import * as ReviewActions from '../../store/review.action';
import { getReviews } from '../../store/review.state';

@Component({
  selector: 'app-product',
  templateUrl: 'product.component.html',
  styleUrls: ['product.component.scss']
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
              private store: Store<AppState>,
              private authService: AuthService,
              private modalService: NgbModal) {
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
        if (this.type === 'game') {
          //observables.push(this.currentService.getGenres(this.product.genres));
          observables.push(this.currentService.getDevelopers(this.product.developers));
        }
        if (this.type === 'movie') {
          observables.push(this.currentService.getCredits(this.id));
        }
        this.store.dispatch(new ReviewActions.GetReviews(`${this.type}${this.id}`));

        return Observable.forkJoin(observables)
      })
      .subscribe(([recommended, ...data]: [Product[], any]) => {
        this.recommended = recommended;
        this.recommended.forEach((item) => item.coverUrl = item.cover);
        if (this.type === 'game') {
          //this.product.genres = data[0];
          this.product.developers = data[0]
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
    this.store.select(getReviews).subscribe((reviews: Review[]) => this.reviews = reviews);
  }

  public addToCart(product: Product): void {
    this.store.dispatch(new CartActions.AddToCart(product));
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
          this.store.dispatch(new ReviewActions.AddReview(bufferReview));
        },
        () => null
      )
  }
}
