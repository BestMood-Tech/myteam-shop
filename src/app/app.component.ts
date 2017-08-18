import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastsManager } from 'ng2-toastr';

import { Profile } from './shared/models/profile.model';
import { AuthService, Cart, HelperService } from './shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public searchTermForm: FormGroup;
  public showFilters: boolean;
  public searchObj = {
    q: '',
    checkMovies: true,
    checkBooks: true,
    checkGames: true
  };
  public changedCount = false;
  public user: Profile;

  constructor(public auth: AuthService,
              private router: Router,
              private cart: Cart,
              private fb: FormBuilder,
              private viewContainer: ViewContainerRef,
              private toastr: ToastsManager,
              private helperService: HelperService) {
    this.toastr.setRootViewContainerRef(this.viewContainer);
  }

  public ngOnInit() {
    this.searchTermForm = this.fb.group({term: ''});
    this.helperService.showFilters.subscribe((data) => {
      setTimeout(() => this.showFilters = data);
      if (!data) {
        this.searchTermForm.reset();
      }
    });
    this.helperService.updateFilters.subscribe((filters) => {
      this.searchObj.checkMovies = filters['checkMovies'];
      this.searchObj.checkBooks = filters['checkBooks'];
      this.searchObj.checkGames = filters['checkGames'];
    });

    this.cart.changedCount.subscribe(() => {
      this.changedCount = true;

      setTimeout(() => this.changedCount = false, 1000);
    });
    this.auth.profile.subscribe((user: Profile) => this.user = user);
    this.auth.getProfile();
  }

  public search() {
    const searchTerm = this.searchTermForm.value.term;
    if (!searchTerm || !(searchTerm.length > 3)) {
      return;
    }
    this.helperService.searchTerm = searchTerm;
    this.searchObj.q = searchTerm;
    this.router.navigate(['/search'], {queryParams: this.searchObj});
  }

  public count() {
    return this.cart.countCart;
  }

}
