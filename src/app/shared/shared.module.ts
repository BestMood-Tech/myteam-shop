import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from './pipes/currency.pipe';
import { MusicService, GamesService, MovieService, Auth, Cart, AuthGuard } from './services';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyPipe
  ],
  declarations: [CurrencyPipe]
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
