import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
/*
 * Third-party modules
 */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
/*
 * Module components
 */
import {
  AddressFormComponent,
  FiltersComponent,
  ProductCardComponent,
  ProfileFieldComponent,
  RatioComponent,
  VideoModalWindowComponent
} from './components';
/*
 * Module guards
 */
import { AuthGuard } from './guards';
/*
 * Module pipes
 */
import { AroundPipe, CapitalizePipe, CurrencyPipe } from './pipes';
/*
 * Module services
 */
import {
  AuthService,
  BooksService,
  CartService,
  GamesService,
  HelperService,
  MoviesService,
  OrderService,
  PromocodeService
} from './services';

import { AppReducer } from '../store/app.reducer';
import { AppEffects } from '../store/app.effect';
import { DragScrollModule } from 'ngx-drag-scroll';
import { RecaptchaModule } from 'ng-recaptcha';

const SharedComponents = [
  ProfileFieldComponent,
  RatioComponent,
  FiltersComponent,
  ProductCardComponent
];

const SharedEntryComponents = [
  VideoModalWindowComponent,
  AddressFormComponent
];

const SharedPipes = [
  CapitalizePipe,
  AroundPipe,
  CurrencyPipe
];

const SharedServices = [
  PromocodeService,
  BooksService,
  GamesService,
  MoviesService,
  AuthService,
  CartService,
  OrderService,
  HelperService
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    StoreModule.forRoot(AppReducer),
    StoreDevtoolsModule.instrument({ maxAge: 50 }),
    EffectsModule.forRoot(AppEffects),
    DragScrollModule,
    RecaptchaModule.forRoot()
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DragScrollModule,
    RecaptchaModule,
    ...SharedComponents,
    ...SharedEntryComponents,
    ...SharedPipes
  ],
  declarations: [
    ...SharedComponents,
    ...SharedEntryComponents,
    ...SharedPipes
  ],
  entryComponents: [
    ...SharedEntryComponents
  ],
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        HttpClient,
        ...SharedServices,
        AuthGuard
      ],
    };
  }
}
