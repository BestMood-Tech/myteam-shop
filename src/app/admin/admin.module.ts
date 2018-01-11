import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AgGridModule } from 'ag-grid-angular/src/aggrid.module';
import { ChartsModule } from 'ng2-charts/charts/charts';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule, routingComponents } from './admin-routing.module';
import { AdminService } from './services/admin.service';
import { NumericEditorComponent } from './components/numeric-editor/numeric-editor.component';
import { adminReducer } from './store/admin/admin.reducer';
import { AdminEffects } from './store/admin/admin.effect';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ChartsModule,
    StoreModule.forFeature('admin', adminReducer),
    EffectsModule.forRoot([AdminEffects]),
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
