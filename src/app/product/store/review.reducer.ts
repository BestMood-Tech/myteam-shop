import * as ReviewActions from './review.action';
import { initializeReviewState, ReviewState } from './review.state';

export type Action = ReviewActions.All;

export const defaultReviewState = initializeReviewState();

export function reviewReducer(state = defaultReviewState, action: Action): ReviewState {
  switch (action.type) {
    case ReviewActions.GET_REVIEWS_ERROR:
    case ReviewActions.ADD_REVIEW_ERROR:
      return { ...state, error: action.message };
    case ReviewActions.GET_REVIEWS_SUCCESS:
      return { ...state, reviews: action.reviews, error: null };
    case ReviewActions.ADD_REVIEW_SUCCESS:
      return { ...state, reviews: [action.review, ...state.reviews], error: null };
    default:
      return state;
  }
}
