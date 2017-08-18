import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { DragScrollModule } from 'angular2-drag-scroll';

import { CustomOption } from './customOptionsToasts';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { CategoryResolve } from './category/category.resolve';
import { ProductResolve } from './product/product.resolve';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    DragScrollModule,
    SharedModule.forRoot(),
    ToastModule.forRoot()
  ],
  providers: [
    CategoryResolve,
    ProductResolve,
    { provide: ToastOptions, useClass: CustomOption },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
