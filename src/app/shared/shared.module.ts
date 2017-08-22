import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
/*
 * Third-party modules
 */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
    NgbModule.forRoot()
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
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
        ...SharedServices,
        AuthGuard
      ],
    };
  }
}
