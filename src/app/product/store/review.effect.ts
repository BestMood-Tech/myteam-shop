import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import * as ReviewActions from './review.action';
import { Review } from '../../shared/models/index';
import { HttpErrorResponse } from '@angular/common/http';
import { ReviewService } from '../services/review.service';

@Injectable()
export class ReviewEffects {

  @Effect()
  GetReviews$: Observable<Action> = this.actions
    .ofType<ReviewActions.GetReviews>(ReviewActions.GET_REVIEWS)
    .mergeMap((action: ReviewActions.GetReviews) =>
      this.reviewService.get(action.id)
        .map((reviews: Review[]) => new ReviewActions.GetReviewsSuccess(reviews))
        .catch((error: HttpErrorResponse) => of(new ReviewActions.GetReviewsError(error.error.errorMessage)))
    );

  @Effect()
  AddReview$: Observable<Action> = this.actions
    .ofType<ReviewActions.AddReview>(ReviewActions.ADD_REVIEW)
    .mergeMap((action: ReviewActions.AddReview) => {
      return this.reviewService.add(action.review)
        .map((review: Review) => new ReviewActions.AddReviewSuccess(review))
        .catch((error: HttpErrorResponse) => of(new ReviewActions.AddReviewError(error.error.errorMessage)))
      }
    );

  constructor(private reviewService: ReviewService,
              private actions: Actions) {
  }
}
