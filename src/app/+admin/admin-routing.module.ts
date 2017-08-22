import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './analytics/analytics.component';

import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: 'orders', component: OrdersComponent },
  { path: 'users', component: UsersComponent },
  { path: 'analytics', component: AnalyticsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule {
}

export const routingComponents = [
  OrdersComponent,
  UsersComponent,
  AnalyticsComponent
];
