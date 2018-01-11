import * as PromocodeActions from './promocode.action';
import { initializePromocodeState, PromocodeState } from './promocode.state';

export type Action = PromocodeActions.All;

export const defaultPromocodeState = initializePromocodeState();

export function promocodeReducer(state = defaultPromocodeState, action: Action): PromocodeState {
  switch (action.type) {
    case PromocodeActions.GET_PROMOCODE_ERROR:
    case PromocodeActions.CREATE_PROMOCODE_ERROR:
    case PromocodeActions.CHECK_PROMOCODE_ERROR:
    case PromocodeActions.REMOVE_PROMOCODE_ERROR:
      return { ...state, error: action.message, percent: null };
    case PromocodeActions.CREATE_PROMOCODE_SUCCESS:
    case PromocodeActions.CHECK_PROMOCODE_SUCCESS:
      return { ...state, percent: action.percent, error: null };
    case PromocodeActions.GET_PROMOCODE_SUCCESS:
      return { ...state, promocode: action.promocode, error: null, percent: null };
    case PromocodeActions.REMOVE_PROMOCODE_SUCCESS:
      return { ...state, promocode: null, error: null, percent: null };
    default:
      return state;
  }
}
