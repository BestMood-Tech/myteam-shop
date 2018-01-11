import { ActionReducerMap } from '@ngrx/store';

import { AppState } from './app.state';
import { cartReducer } from './cart/cart.reducer';
import { promocodeReducer } from './promocode/promocode.reducer';

export const AppReducer: ActionReducerMap<AppState> = {
  cart: cartReducer,
  promocode: promocodeReducer
};

