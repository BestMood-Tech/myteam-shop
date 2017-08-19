import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { DragScrollModule } from 'angular2-drag-scroll';
import { RecaptchaModule } from 'ng2-recaptcha';

import { CustomOption } from './customOptionsToasts';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { CategoryResolve } from './category/category.resolve';
import { ProductResolve } from './product/product.resolve';
import { ReviewFormComponent } from './review-form/review-form.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    ReviewFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AppRoutingModule,
    DragScrollModule,
    RecaptchaModule.forRoot(),
    SharedModule.forRoot(),
    ToastModule.forRoot()
  ],
  providers: [
    CategoryResolve,
    ProductResolve,
    { provide: ToastOptions, useClass: CustomOption },
  ],
  entryComponents: [ReviewFormComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
}
