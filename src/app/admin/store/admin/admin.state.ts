import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Order } from '../../../shared/models';
import * as RootState from '../../../store/app.state'

export interface State {
  isLoading: boolean;
  error: string;
  fromYear: string;
  toYear: string;
  isFake: boolean;
  orders: Order[];
}

export const initializeAdminState: () => State = () => ({
  isLoading: false,
  error: null,
  fromYear: null,
  toYear: null,
  isFake: false,
  orders: []
});

export interface AdminState extends RootState.AppState {
  admin: State
}

export const getAdminState = createFeatureSelector<State>('admin');

export const getOrders = createSelector(getAdminState,
  (state: State) => state.orders);
