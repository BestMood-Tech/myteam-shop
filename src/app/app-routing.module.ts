import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressComponent } from './address/address.component';
import { CartComponent } from './cart/cart.component';
import { CategoryComponent } from './category/category.component';
import { CategoryResolve } from './category/category.resolve';
import { CheckoutComponent } from './checkout/checkout.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { HomeComponent } from './home/home.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductComponent } from './product/product.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import { AuthGuard } from './shared/guards';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'category/books', component: CategoryComponent, resolve: { category: CategoryResolve } },
  { path: 'category/games', component: CategoryComponent, resolve: { category: CategoryResolve } },
  { path: 'category/movies', component: CategoryComponent, resolve: { category: CategoryResolve } },
  { path: 'search', component: SearchComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent },
  { path: 'category/:type/:id', component: ProductComponent },
  { path: 'confirmation/:id', component: ConfirmationComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'address', component: AddressComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'admin', loadChildren: './+admin/admin.module#AdminModule' }
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
  AddressComponent,
  OrdersComponent
];
