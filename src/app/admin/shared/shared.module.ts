import { NgModule, ModuleWithProviders } from '@angular/core';
import { AdminService } from './service/admin.service';

@NgModule({
  imports: [],
  exports: [],
  declarations: []
})

export class AdminSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AdminSharedModule,
      providers: [
        AdminService
      ]
    };
  }
}
