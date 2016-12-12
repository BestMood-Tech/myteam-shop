import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule, routingAdminComponents } from './admin-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AdminService } from './admin.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule.forRoot()
  ],
  declarations: [
    routingAdminComponents,
    OrdersComponent,
    UsersComponent,
    AnalyticsComponent,
  ],
  providers: [ AdminService ]
})
export class AdminModule { }
