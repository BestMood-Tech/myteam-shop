import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from './pipes/currency.pipe';
import { BooksService, GamesService, MovieService, Auth, Cart, AuthGuard } from './services';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { HelperService } from './services/helper.service';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { RouterModule } from '@angular/router';
import { FiltersComponent } from './components/filter/filters.component';
import { RatioComponent } from './components/ratio/ratio.component';
import { MyAroundPipe } from './pipes/around.pipe';
import { ProfileFieldComponent } from './components/profile-field/profile-field.component';
import { VideoModalWindowComponent } from './components/video-modal-window/video.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { PromocodeService } from './services/promocode.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyPipe,
    MyAroundPipe,
    CapitalizePipe,
    NgbModule,
    AddressFormComponent,
    ProductCardComponent,
    FiltersComponent,
    RatioComponent,
    ProfileFieldComponent,
    VideoModalWindowComponent
  ],
  declarations: [
    CurrencyPipe,
    MyAroundPipe,
    CapitalizePipe,
    AddressFormComponent,
    ProductCardComponent,
    FiltersComponent,
    RatioComponent,
    ProfileFieldComponent,
    VideoModalWindowComponent
  ],
  entryComponents: [
    AddressFormComponent,
    VideoModalWindowComponent
  ],
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        BooksService,
        GamesService,
        MovieService,
        Auth,
        AuthGuard,
        Cart,
        HelperService,
        PromocodeService
      ],
    };
  }
}
