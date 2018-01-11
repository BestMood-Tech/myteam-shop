import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import { ProductRoutingModule, routingComponents } from './product-routing.module';
import { ReviewService } from './services/review.service';
import { reviewReducer } from './store/review.reducer';
import { ReviewEffects } from './store/review.effect';
import { ReviewFormComponent } from './components/review-form/review-form.component';

@NgModule({
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    StoreModule.forFeature('review', reviewReducer),
    EffectsModule.forRoot([ReviewEffects]),
  ],
  declarations: [
    routingComponents,
    ReviewFormComponent
  ],
  entryComponents: [ReviewFormComponent],
  providers: [ReviewService]
})
export class ProductModule {
}
