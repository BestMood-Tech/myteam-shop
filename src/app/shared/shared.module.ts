import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  VideoModalWindowComponent,
  ProfileFieldComponent,
  RatioComponent,
  FiltersComponent,
  ProductCardComponent,
  AddressFormComponent
} from './components';
/*
 * Module pipes
 */
import {
  CapitalizePipe,
  AroundPipe,
  CurrencyPipe
} from './pipes';
/*
 * Module services
 */
import {
  PromocodeService,
  BooksService,
  GamesService,
  MoviesService,
  AuthService,
  CartService,
  OrderService,
  HelperService
} from './services';
/*
 * Module guards
 */
import { AuthGuard } from './guards';

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
