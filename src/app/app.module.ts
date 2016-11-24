import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { SearchComponent } from './search/search.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { HomeComponent } from './home/home.component';
import { BasketComponent } from './basket/basket.component';

import { AppRoutingModule } from './app-routing.module';

import { CurrencyPipe, MusicService, GamesService, FilmsService } from './shared';

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    ProductComponent,
    SearchComponent,
    CheckoutComponent,
    ConfirmationComponent,
    HomeComponent,
    BasketComponent,
    CurrencyPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    MusicService,
    FilmsService,
    GamesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
