import { Action } from '@ngrx/store';

import { Product, Promocode } from '../../shared/models';
import { Percent } from '../../shared/services';

export const GET_PROMOCODE = '[Promocode] GET';
export const GET_PROMOCODE_SUCCESS = '[Promocode] GET_SUCCESS';
export const GET_PROMOCODE_ERROR = '[Promocode] GET_ERROR';
export const CREATE_PROMOCODE = '[Promocode] CREATE';
export const CREATE_PROMOCODE_SUCCESS = '[Promocode] CREATE_SUCCESS';
export const CREATE_PROMOCODE_ERROR = '[Promocode] CREATE_ERROR';
export const REMOVE_PROMOCODE = '[Promocode] REMOVE';
export const REMOVE_PROMOCODE_SUCCESS = '[Promocode] REMOVE_SUCCESS';
export const REMOVE_PROMOCODE_ERROR = '[Promocode] REMOVE_ERROR';
export const CHECK_PROMOCODE = '[Promocode] CHECK';
export const CHECK_PROMOCODE_SUCCESS = '[Promocode] CHECK_SUCCESS';
export const CHECK_PROMOCODE_ERROR = '[Promocode] CHECK_ERROR';

export class GetPromocode implements Action {
  readonly type = GET_PROMOCODE;

  constructor(public id: string) {
  }
}

export class GetPromocodeSuccess implements Action {
  readonly type = GET_PROMOCODE_SUCCESS;

  constructor(public promocode: Promocode) {
  }
}

export class GetPromocodeError implements Action {
  readonly type = GET_PROMOCODE_ERROR;

  constructor(public message: string) {
  }
}

export class CreatePromocode implements Action {
  readonly type = CREATE_PROMOCODE;

  constructor(public id: string, public isNewUser: boolean, public orderCount?: number) {
  }
}

export class CreatePromocodeSuccess implements Action {
  readonly type = CREATE_PROMOCODE_SUCCESS;

  constructor(public percent: Percent) {
  }
}

export class CreatePromocodeError implements Action {
  readonly type = CREATE_PROMOCODE_ERROR;

  constructor(public message: string) {
  }
}

export class RemovePromocode implements Action {
  readonly type = REMOVE_PROMOCODE;

  constructor(public id: string) {
  }
}

export class RemovePromocodeSuccess implements Action {
  readonly type = REMOVE_PROMOCODE_SUCCESS;
}

export class RemovePromocodeError implements Action {
  readonly type = REMOVE_PROMOCODE_ERROR;

  constructor(public message: string) {
  }
}

export class CheckPromocode implements Action {
  readonly type = CHECK_PROMOCODE;

  constructor(public id: string, public promocode: string) {
  }
}

export class CheckPromocodeSuccess implements Action {
  readonly type = CHECK_PROMOCODE_SUCCESS;

  constructor(public percent: Percent) {
  }
}

export class CheckPromocodeError implements Action {
  readonly type = CHECK_PROMOCODE_ERROR;

  constructor(public message: string) {
  }
}

export type All = GetPromocode | GetPromocodeSuccess | GetPromocodeError | CheckPromocode | CheckPromocodeError | CheckPromocodeSuccess|
  CreatePromocode | CreatePromocodeSuccess | CreatePromocodeError | RemovePromocode | RemovePromocodeError | RemovePromocodeSuccess;
