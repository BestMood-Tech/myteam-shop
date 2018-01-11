import { CartState } from './cart/cart.state';
import { PromocodeState } from './promocode/promocode.state';

export interface AppState {
  cart: CartState,
  promocode: PromocodeState
}
