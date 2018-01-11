import { initializeAdminState, State } from './admin.state';
import * as AdminActions from './admin.action';

export type Action = AdminActions.All;

export const defaultAdminState = initializeAdminState();

export function adminReducer(state = defaultAdminState, action: Action): State {
  switch (action.type) {
    case AdminActions.GET_ADMIN_DATA:
      return { ...state, isLoading: true, fromYear: action.fromYear, toYear: action.toYear, isFake: action.isFake };
    case AdminActions.GET_ADMIN_DATA_SUCCESS:
      return { ...state,  isLoading: false, orders: action.orders };
    case AdminActions.GET_ADMIN_DATA_ERROR:
      return { ...state, isLoading: false, error: action.message };
    default:
      return state;
  }
}
