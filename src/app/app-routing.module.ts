import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { SearchComponent } from './search/search.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { ProfileComponent } from './profile/profile.component';
import { AddressComponent } from './address/address.component';
import { AuthGuard } from './shared/services/authGuard.service';
import { CategoryResolve } from './category/category.resolve';
import { ProductResolve } from './product/product.resolve';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: HomeComponent},
  {path: 'category/books', component: CategoryComponent, resolve: {category: CategoryResolve}},
  {path: 'category/games', component: CategoryComponent, resolve: {category: CategoryResolve}},
  {path: 'category/movies', component: CategoryComponent, resolve: {category: CategoryResolve}},
  {path: 'search', component: SearchComponent},
  {path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard]},
  {path: 'cart', component: CartComponent},
  {path: 'category/:type/:id', component: ProductComponent, resolve: {product: ProductResolve}},
  {path: 'confirmation', component: ConfirmationComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'address', component: AddressComponent, canActivate: [AuthGuard]},
  {path: 'cart', component: CartComponent},
  {path: 'admin', loadChildren: './+admin/admin.module#AdminModule'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

export const routingComponents = [
  HomeComponent,
  CartComponent,
  CategoryComponent,
  CheckoutComponent,
  ConfirmationComponent,
  ProductComponent,
  SearchComponent,
  ProfileComponent,
  AddressComponent
];
