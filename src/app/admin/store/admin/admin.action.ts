import { Action } from '@ngrx/store';
import { Order } from '../../../shared/models';

export const REQUEST_ADMIN_DATA = '[Admin] REQUEST_DATA';
export const GET_ADMIN_DATA = '[Admin] GET_DATA';
export const GET_ADMIN_DATA_SUCCESS = '[Admin] GET_DATA_SUCCESS';
export const GET_ADMIN_DATA_ERROR = '[Admin] GET_DATA-ERROR';

export class RequestAdminData implements Action {
  readonly type = REQUEST_ADMIN_DATA;

  constructor(public fromYear: string = null, public toYear: string = null, public isFake = true) {
  }
}

export class GetAdminData implements Action {
  readonly type = GET_ADMIN_DATA;

  constructor(public fromYear: string = null, public toYear: string = null, public isFake = true) {
  }
}

export class GetAdminDataSuccess implements Action {
  readonly type = GET_ADMIN_DATA_SUCCESS;

  constructor(public orders: Order[]) {
  }
}

export class GetAdminDataError implements Action {
  readonly type = GET_ADMIN_DATA_ERROR;

  constructor(public message: string) {
  }
}

export type All = RequestAdminData | GetAdminData | GetAdminDataSuccess | GetAdminDataError;
