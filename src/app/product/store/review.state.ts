import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Review } from '../../shared/models/index';

export interface ReviewState {
  reviews: Review[],
  error: string
}

export const initializeReviewState: () => ReviewState = () => ({
  reviews: [],
  error: null
});

export const getReviewState = createFeatureSelector<ReviewState>('review');

export const getReviews = createSelector(getReviewState,
  (state: ReviewState) => state.reviews);
