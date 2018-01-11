import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryResolve } from './category/category.resolve';
import { CustomOption } from './customOptionsToasts';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule.forRoot(),
    ToastModule.forRoot()
  ],
  providers: [
    CategoryResolve,
    { provide: ToastOptions, useClass: CustomOption },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
