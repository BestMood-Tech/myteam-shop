import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from './pipes/currency.pipe';
import { MusicService, GamesService, MovieService, Auth, Cart, AuthGuard } from './services';
import { ProductCardComponent } from './components/product-card.component';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyPipe,
    ProductCardComponent
  ],
  declarations: [CurrencyPipe, ProductCardComponent]
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
        Cart
      ]
    };
  }
}
