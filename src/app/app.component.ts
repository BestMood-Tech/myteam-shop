import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Auth } from './shared/services/auth.service';
import { Cart } from './shared/services/cart.service';
import { AuthGuard } from './shared/services/authGuard.service';
import { ToastsManager } from 'ng2-toastr';
import { HelperService } from './shared/services/helper.service';

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

  constructor(public authGuard: AuthGuard,
              public auth: Auth,
              private router: Router,
              private route: ActivatedRoute,
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
      this.showFilters = data;
      if (!data) {
        this.searchTermForm.reset();
      }
    });
    this.helperService.updateFilters.subscribe((filters) => {
      this.searchObj.checkMovies = filters['checkMovies'];
      this.searchObj.checkBooks = filters['checkBooks'];
      this.searchObj.checkGames = filters['checkGames'];
    });
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
