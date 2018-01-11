import { Action } from '@ngrx/store';

import { Product } from '../../shared/models';

export const GET_CART = '[Cart] GET';
export const REQUEST_CART = '[Cart] REQUEST';
export const GET_CART_SUCCESS = '[Cart] GET_SUCCESS';
export const GET_CART_ERROR = '[Cart] GET_ERROR';
export const ADD_TO_CART = '[Cart] ADD';
export const ADD_TO_CART_SUCCESS = '[Cart] ADD_SUCCESS';
export const ADD_TO_CART_ERROR = '[Cart] ADD_ERROR';
export const REMOVE_FROM_CART = '[Cart] REMOVE';
export const REMOVE_FROM_CART_SUCCESS = '[Cart] REMOVE_SUCCESS';
export const REMOVE_FROM_CART_ERROR = '[Cart] REMOVE_ERROR';
export const CLEAR_CART = '[Cart] CLEAR';
export const CLEAR_CART_SUCCESS = '[Cart] CLEAR_SUCCESS';
export const CLEAR_CART_ERROR = '[Cart] CLEAR_ERROR';
export const GET_INVOICE = '[Cart] GET_INVOICE';
export const GET_INVOICE_SUCCESS = '[Cart] GET_INVOICE_SUCCESS';
export const GET_INVOICE_ERROR = '[Cart] GET_INVOICE_ERROR';

export class GetCart implements Action {
  readonly type = GET_CART;
}

export class RequestCart implements Action {
  readonly type = REQUEST_CART;
}

export class GetCartSuccess implements Action {
  readonly type = GET_CART_SUCCESS;

  constructor(public products: Product[]) {
  }
}

export class GetCartError implements Action {
  readonly type = GET_CART_ERROR;

  constructor(public message: string) {
  }
}

export class AddToCart implements Action {
  readonly type = ADD_TO_CART;

  constructor(public product: Product) {
  }
}

export class AddToCartSuccess implements Action {
  readonly type = ADD_TO_CART_SUCCESS;

  constructor(public products: Product[]) {
  }
}

export class AddToCartError implements Action {
  readonly type = ADD_TO_CART_ERROR;

  constructor(public message: string) {
  }
}

export class RemoveFromCart implements Action {
  readonly type = REMOVE_FROM_CART;

  constructor(public product: Product) {
  }
}

export class RemoveFromCartSuccess implements Action {
  readonly type = REMOVE_FROM_CART_SUCCESS;

  constructor(public products: Product[]) {
  }
}

export class RemoveFromCartError implements Action {
  readonly type = REMOVE_FROM_CART_ERROR;

  constructor(public message: string) {
  }
}

export class ClearCart implements Action {
  readonly type = CLEAR_CART;
}

export class ClearCartSuccess implements Action {
  readonly type = CLEAR_CART_SUCCESS;
}

export class ClearCartError implements Action {
  readonly type = CLEAR_CART_ERROR;

  constructor(public message: string) {
  }
}

export class GetInvoice implements Action {
  readonly type = GET_INVOICE;

  constructor(public id: string) {
  }
}

export class GetInvoiceSuccess implements Action {
  readonly type = GET_INVOICE_SUCCESS;

  constructor(public url: string) {
  }
}

export class GetInvoiceError implements Action {
  readonly type = GET_INVOICE_ERROR;

  constructor(public message: string) {
  }
}

export type All = GetCart | RequestCart | GetCartSuccess | GetCartError | AddToCart | AddToCartSuccess | AddToCartError |
  RemoveFromCart | RemoveFromCartSuccess | RemoveFromCartError | ClearCart | ClearCartSuccess | ClearCartError | GetInvoice |
  GetInvoiceSuccess | GetInvoiceError;
