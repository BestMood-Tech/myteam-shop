import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastsManager } from 'ng2-toastr';

import { Profile } from './shared/models/profile.model';
import { AuthService, CartService, HelperService } from './shared/services';
import { Search } from './shared/helper';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {
  public showFilters: boolean;
  public filters: Search;
  public changedCount = false;
  public user: Profile;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private cartService: CartService,
              private viewContainer: ViewContainerRef,
              private toastr: ToastsManager,
              private helperService: HelperService) {
    this.toastr.setRootViewContainerRef(this.viewContainer);
  }

  public ngOnInit() {
    this.resetFilter();

    this.route.queryParams.subscribe((params) => {
      if (params.hasOwnProperty('query')) {
        this.filters = new Search(params);
      }
    });
    this.helperService.showFilters.subscribe((data: boolean) => {
      setTimeout(() => this.showFilters = data);
      if (!data) {
        this.resetFilter();
      }
    });

    this.cartService.changedCount.subscribe(() => {
      this.changedCount = true;
      setTimeout(() => this.changedCount = false, 1000);
    });
    this.authService.profile.subscribe((user: Profile) => this.user = user);
    this.authService.get();
  }

  public search(): void {
    this.router.navigate(['/search'], { queryParams: this.filters });
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

  public count(): number {
    return this.cartService.count;
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
