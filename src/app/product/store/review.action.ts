import { Action } from '@ngrx/store';

import { Review } from '../../shared/models/index';

export const GET_REVIEWS = '[Review] GET';
export const GET_REVIEWS_SUCCESS = '[Review] GET_SUCCESS';
export const GET_REVIEWS_ERROR = '[Review] GET_ERROR';
export const ADD_REVIEW = '[Review] ADD';
export const ADD_REVIEW_SUCCESS = '[Review] ADD_SUCCESS';
export const ADD_REVIEW_ERROR = '[Review] ADD_ERROR';

export class GetReviews implements Action {
  readonly type = GET_REVIEWS;

  constructor(public id: string) {
  }
}

export class GetReviewsSuccess implements Action {
  readonly type = GET_REVIEWS_SUCCESS;

  constructor(public reviews: Review[]) {
  }
}

export class GetReviewsError implements Action {
  readonly type = GET_REVIEWS_ERROR;

  constructor(public message: string) {
  }
}

export class AddReview implements Action {
  readonly type = ADD_REVIEW;

  constructor(public review: Review) {
  }
}

export class AddReviewSuccess implements Action {
  readonly type = ADD_REVIEW_SUCCESS;

  constructor(public review: Review) {
  }
}

export class AddReviewError implements Action {
  readonly type = ADD_REVIEW_ERROR;

  constructor(public message: string) {
  }
}


export type All = GetReviews | GetReviewsError | GetReviewsSuccess | AddReview | AddReviewError | AddReviewSuccess;
