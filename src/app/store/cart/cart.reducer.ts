import * as CartActions from './cart.action';
import { CartState, initializeCartState } from './cart.state';

export type Action = CartActions.All;

export const defaultCartState = initializeCartState();

export function cartReducer(state = defaultCartState, action: Action): CartState {
  switch (action.type) {
    case CartActions.GET_CART_SUCCESS:
    case CartActions.ADD_TO_CART_SUCCESS:
    case CartActions.REMOVE_FROM_CART_SUCCESS:
      return { ...state, cart: action.products, error: null, invoice: null };
    case CartActions.GET_CART_ERROR:
    case CartActions.ADD_TO_CART_ERROR:
    case CartActions.REMOVE_FROM_CART_ERROR:
    case CartActions.CLEAR_CART_ERROR:
    case CartActions.GET_INVOICE_ERROR:
      return { ...state, error: action.message, invoice: null };
    case CartActions.CLEAR_CART_SUCCESS:
      return { ...state, cart: [], error: null, invoice: null };
    case CartActions.GET_INVOICE_SUCCESS:
      return { ...state, invoice: action.url, error: null };
    default:
      return state;
  }
}
