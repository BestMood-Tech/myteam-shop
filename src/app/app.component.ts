import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastsManager } from 'ng2-toastr';
import { Store } from '@ngrx/store';

import { Profile } from './shared/models';
import { AuthService, HelperService } from './shared/services';
import { Search } from './shared/helper';
import { getCartCount } from './store/cart/cart.state';
import { AppState } from './store/app.state';
import * as CartActions from './store/cart/cart.action';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {
  public showFilters: boolean;
  public filters: Search;
  public changedCount = false;
  public count: number;
  public user: Profile;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private viewContainer: ViewContainerRef,
              private toastsManager: ToastsManager,
              private helperService: HelperService,
              private store: Store<AppState>) {
    this.toastsManager.setRootViewContainerRef(this.viewContainer);
  }

  public ngOnInit() {
    this.resetFilter();

    this.route.queryParams.subscribe((params) => {
      if (params.hasOwnProperty('query')) {
        this.filters = new Search(params);
      }});
    this.helperService.showFilters.subscribe((data: boolean) => {
      setTimeout(() => this.showFilters = data);
      if (!data) {
        this.resetFilter();
      }
    });

    this.store.select(getCartCount).subscribe((count: number) => {
      if (this.count < count) {
        this.changedCount = true;
        setTimeout(() => this.changedCount = false, 1000);
      }
      this.count = count;
    });
    this.store.dispatch(new CartActions.RequestCart());
    this.authService.profile.subscribe((user: Profile) => this.user = user);
    this.authService.get();
  }

  public search(): void {
    this.router.navigate(['/search'], {queryParams: this.filters });
  }

  public isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  public login(): void {
    this.authService.login();
  }

  public logout(): void {
    this.authService.logout();
  }

  private resetFilter(): void {
    this.filters = new Search({
      query: '',
      books: true,
      games: true,
      movies: true
    });
  }

}
