import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { SearchComponent } from './search/search.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { HomeComponent } from './home/home.component';
import { BasketComponent } from './cart/cart.component';
import { ProfileComponent } from './profile/profile.component';
import { AddressComponent } from './address/address.component';
import { Auth } from './shared/services/auth.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'category/:type', component: CategoryComponent },
  { path: 'search', component: SearchComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart', component: BasketComponent },
  { path: 'product', component: ProductComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [Auth] },
  { path: 'address', component: AddressComponent, canActivate: [Auth] }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

export const routingComponents = [
  HomeComponent,
  BasketComponent,
  CategoryComponent,
  CheckoutComponent,
  ConfirmationComponent,
  ProductComponent,
  SearchComponent,
  ProfileComponent,
  AddressComponent
];
