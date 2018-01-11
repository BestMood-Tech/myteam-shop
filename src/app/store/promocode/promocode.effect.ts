import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import * as PromocodeActions from './promocode.action';
import { Promocode } from '../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { Percent, PromocodeService } from '../../shared/services';

@Injectable()
export class PromocodeEffects {

  @Effect()
  GetPromocode$: Observable<Action> = this.actions
    .ofType<PromocodeActions.GetPromocode>(PromocodeActions.GET_PROMOCODE)
    .mergeMap((action: PromocodeActions.GetPromocode) =>
      this.promocodeService.get(action.id)
        .map((promocode: Promocode) => new PromocodeActions.GetPromocodeSuccess(promocode))
        .catch((error: HttpErrorResponse) => of(new PromocodeActions.GetPromocodeError(error.error.errorMessage)))
    );

  @Effect()
  CreatePromocode$: Observable<Action> = this.actions
    .ofType<PromocodeActions.CreatePromocode>(PromocodeActions.CREATE_PROMOCODE)
    .mergeMap((action: PromocodeActions.CreatePromocode) => {
      return this.promocodeService.create(action.id, action.isNewUser, action.orderCount)
        .map((percent: Percent) => new PromocodeActions.CreatePromocodeSuccess(percent))
        .catch((error: HttpErrorResponse) => of(new PromocodeActions.CreatePromocodeError(error.error.errorMessage)))
      }
    );

  @Effect()
  RemovePromocode$: Observable<Action> = this.actions
    .ofType<PromocodeActions.RemovePromocode>(PromocodeActions.REMOVE_PROMOCODE)
    .mergeMap((action: PromocodeActions.RemovePromocode) =>
      this.promocodeService.remove(action.id)
        .map(() => new PromocodeActions.RemovePromocodeSuccess())
        .catch((error: HttpErrorResponse) => of(new PromocodeActions.RemovePromocodeError(error.error.errorMessage)))
    );

  @Effect()
  CheckPromocode$: Observable<Action> = this.actions
    .ofType<PromocodeActions.CheckPromocode>(PromocodeActions.CHECK_PROMOCODE)
    .mergeMap((action: PromocodeActions.CheckPromocode) =>
      this.promocodeService.check(action.id, action.promocode)
        .map((percent: Percent) => new PromocodeActions.CheckPromocodeSuccess(percent))
        .catch((error: HttpErrorResponse) => of(new PromocodeActions.CheckPromocodeError(error.error.errorMessage)))
    );

  constructor(private promocodeService: PromocodeService,
              private actions: Actions) {
  }
}
