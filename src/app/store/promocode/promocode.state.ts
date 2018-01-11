import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Promocode } from '../../shared/models';
import { Percent } from '../../shared/services';

export interface PromocodeState {
  promocode: Promocode,
  percent: Percent,
  error: string
}

export const initializePromocodeState: () => PromocodeState = () => ({
  promocode: null,
  percent: null,
  error: null
});

export const getPromocodeState = createFeatureSelector<PromocodeState>('promocode');

export const getPromocode = createSelector(getPromocodeState,
  (state: PromocodeState) => state.promocode);
export const getPromocodeError = createSelector(getPromocodeState,
  (state: PromocodeState) => state.error);
export const getPromocodePercent = createSelector(getPromocodeState,
  (state: PromocodeState) => state.percent);
