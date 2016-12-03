import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from './pipes/currency.pipe';
import { MusicService, GamesService, MovieService, Auth, Cart, AuthGuard } from './services';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { HelperService } from './services/helper.service';
import { ProductCardComponent } from './components/product-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyPipe,
    NgbModule,
    AddressFormComponent,
    ProductCardComponent
  ],
  declarations: [CurrencyPipe, AddressFormComponent, ProductCardComponent],
  entryComponents:[AddressFormComponent]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        MusicService,
        GamesService,
        MovieService,
        Auth,
        AuthGuard,
        Cart,
        HelperService
      ]
    };
  }
}
