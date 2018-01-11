import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { CartService } from '../../shared/services';
import * as CartActions from './cart.action';
import { Product } from '../../shared/models';
import { CartState } from './cart.state';
import { HttpErrorResponse } from '@angular/common/http';
import { AppState } from '../app.state';

@Injectable()
export class CartEffects {

  @Effect()
  GetCart$: Observable<Action> = this.actions
    .ofType<CartActions.GetCart>(CartActions.GET_CART)
    .mergeMap((action: CartActions.GetCart) =>
      this.cartService.get()
        .map((products: Product[]) => new CartActions.GetCartSuccess(products))
        .catch((error: string) => of(new CartActions.GetCartError(error)))
    );

  @Effect()
  RequestCart$: Observable<Action> = this.actions
    .ofType<CartActions.RequestCart>(CartActions.REQUEST_CART)
    .withLatestFrom(this.store)
    .filter(([action, state]: [CartActions.RequestCart, AppState]) => this.shouldBeFetched(action, state.cart))
    .map(([action, state]: [CartActions.RequestCart, AppState]) => new CartActions.GetCart());

  @Effect()
  AddToCart$: Observable<Action> = this.actions
    .ofType<CartActions.AddToCart>(CartActions.ADD_TO_CART)
    .withLatestFrom(this.store)
    .mergeMap(([action, state]: [CartActions.AddToCart, AppState]) => {
      return this.cartService.add(state.cart.cart, action.product)
        .map((products: Product[]) => new CartActions.AddToCartSuccess(products))
        .catch((error: string) => of(new CartActions.AddToCartError(error)))
      }
    );

  @Effect()
  RemoveFromCart$: Observable<Action> = this.actions
    .ofType<CartActions.RemoveFromCart>(CartActions.REMOVE_FROM_CART)
    .withLatestFrom(this.store)
    .mergeMap(([action, state]: [CartActions.RemoveFromCart, AppState]) =>
      this.cartService.remove(state.cart.cart, action.product)
        .map((products: Product[]) => new CartActions.RemoveFromCartSuccess(products))
        .catch((error: string) => of(new CartActions.RemoveFromCartError(error)))
    );

  @Effect()
  ClearCart$: Observable<Action> = this.actions
    .ofType<CartActions.ClearCart>(CartActions.CLEAR_CART)
    .mergeMap((action: CartActions.ClearCart) =>
      this.cartService.clear()
        .map((products: Product[]) => new CartActions.ClearCartSuccess())
        .catch((error: string) => of(new CartActions.ClearCartError(error)))
    );

  @Effect()
  GetInvoice$: Observable<Action> = this.actions
    .ofType<CartActions.GetInvoice>(CartActions.GET_INVOICE)
    .mergeMap((action: CartActions.GetInvoice) =>
      this.cartService.printInvoice(action.id)
        .map((url: string) => new CartActions.GetInvoiceSuccess(url))
        .catch((errorResponse: HttpErrorResponse) => of(new CartActions.GetInvoiceError(errorResponse.error.errorMessage)))
    );

  constructor(private cartService: CartService,
              private actions: Actions,
              private store: Store<AppState>) {
  }

  private shouldBeFetched(action: CartActions.RequestCart, state: CartState): boolean {
    return state.cart.length === 0
  }
}
