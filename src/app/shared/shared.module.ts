import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
/*
 * Third-party modules
 */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecaptchaModule } from 'ng2-recaptcha';
/*
 * Module components
 */
import {
  ReviewFormComponent,
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
  ReviewsService,
  PromocodeService,
  BooksService,
  GamesService,
  MovieService,
  AuthService,
  Cart,
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
  ReviewFormComponent,
  VideoModalWindowComponent,
  AddressFormComponent
];

const SharedPipes = [
  CapitalizePipe,
  AroundPipe,
  CurrencyPipe
];

const SharedServices = [
  ReviewsService,
  PromocodeService,
  BooksService,
  GamesService,
  MovieService,
  AuthService,
  Cart,
  HelperService
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    RecaptchaModule.forRoot()
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
