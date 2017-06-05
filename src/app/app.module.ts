import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CategoryResolve } from './category/category.resolve';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { ProductResolve } from './product/product.resolve';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent,
        routingComponents
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        SharedModule.forRoot(),
        ToastModule.forRoot()
    ],
    providers: [CategoryResolve, ProductResolve],
    bootstrap: [AppComponent]
})
export class AppModule {
}
