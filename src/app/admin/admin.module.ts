import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule, routingAdminComponents } from './admin-routing.module';
import { AdminSharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminSharedModule.forRoot()
  ],
  declarations: [ routingAdminComponents]
})
export class AdminModule { }
