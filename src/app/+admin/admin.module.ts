import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AdminService } from './admin.service';
import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from 'ng2-charts/charts/charts';
import { AgGridModule } from 'ag-grid-angular/src/aggrid.module';
import { NumericEditorComponent } from './numericEditorComponent/numeric-editor';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ChartsModule,
    AgGridModule.withComponents([
      NumericEditorComponent
    ])
  ],
  declarations: [
    OrdersComponent,
    UsersComponent,
    AnalyticsComponent,
    NumericEditorComponent
  ],
  providers: [ AdminService ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AdminModule {}
