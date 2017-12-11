import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular/src/aggrid.module';

import { ChartsModule } from 'ng2-charts/charts/charts';
import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule, routingComponents } from './admin-routing.module';
import { AdminService } from './admin.service';
import { NumericEditorComponent } from './numeric-editor/numeric-editor';

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
    routingComponents,
    NumericEditorComponent
  ],
  providers: [AdminService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule {
}
