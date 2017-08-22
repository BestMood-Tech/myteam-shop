import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragScrollModule } from 'angular2-drag-scroll';

import { RecaptchaModule } from 'ng2-recaptcha';
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryResolve } from './category/category.resolve';
import { CustomOption } from './customOptionsToasts';
import { ReviewFormComponent } from './review-form/review-form.component';
import { SharedModule } from './shared/shared.module';

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
    { provide: ToastOptions, useClass: CustomOption },
  ],
  entryComponents: [ReviewFormComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
}
