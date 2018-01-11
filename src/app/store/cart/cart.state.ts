import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Product } from '../../shared/models';

export interface CartState {
  cart: Product[],
  error: string,
  invoice: string
}

export const initializeCartState: () => CartState = () => ({
  cart: [],
  error: null,
  invoice: null
});

export const getCartState = createFeatureSelector<CartState>('cart');

export const getCart = createSelector(getCartState,
  (state: CartState) => state.cart);
export const getCartCount = createSelector(getCartState,
  (state: CartState) => {
    let count = 0;
    state.cart.forEach((item) => count += item.count);
    return count
  });
export const getInvoice = createSelector(getCartState,
  (state: CartState) => state.invoice);
