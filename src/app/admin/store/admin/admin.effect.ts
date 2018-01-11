import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { AdminService } from '../../services/admin.service';
import * as AdminActions from './admin.action';
import { Order } from '../../../shared/models';
import { AdminState } from './admin.state';

@Injectable()
export class AdminEffects {

  @Effect()
  GetAdminData$: Observable<Action> = this.actions
    .ofType<AdminActions.GetAdminData>(AdminActions.GET_ADMIN_DATA)
    .mergeMap((action: AdminActions.GetAdminData) =>
      this.adminService.getSelling(action.fromYear, action.toYear, action.isFake)
        .map((orders: Order[]) => new AdminActions.GetAdminDataSuccess(orders))
        .catch((errorResponse: HttpErrorResponse) => of(new AdminActions.GetAdminDataError(errorResponse.error.errorMessage)))
    );

  @Effect()
  RequestAdminData$: Observable<Action> = this.actions
    .ofType<AdminActions.RequestAdminData>(AdminActions.REQUEST_ADMIN_DATA)
    .withLatestFrom(this.store)
    .filter(([action, state]: [AdminActions.RequestAdminData, AdminState]) => this.shouldBeFetched(action, state))
    .map(([action, state]: [AdminActions.RequestAdminData, AdminState]) =>
      new AdminActions.GetAdminData(action.fromYear, action.toYear, action.isFake));


  constructor(private adminService: AdminService,
              private actions: Actions,
              private store: Store<AdminState>) {
  }

  private shouldBeFetched(action: AdminActions.RequestAdminData, state: AdminState): boolean {
    return state.admin.orders.length === 0 || state.admin.fromYear !== action.fromYear
      || state.admin.toYear !== action.toYear || state.admin.isFake !== action.isFake;
  }
}
