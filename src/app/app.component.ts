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
  public navbarCollapsed: boolean;
  public showFilters: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private cart: Cart,
              public auth: Auth,
              private fb: FormBuilder,
              public authGuard: AuthGuard,
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
  }

  public search() {
    const searchTerm = this.searchTermForm.value.term;
    if (!searchTerm || !(searchTerm.length > 3)) {
      return;
    }
    this.helperService.searchTerm = searchTerm;
    const searchObj = {
      q: searchTerm,
      checkMovies: true,
      checkBooks: true,
      checkGames: true
    };
    this.router.navigate(['/search'], {queryParams: searchObj});
    // this.searchTermForm.setValue({term: ''});
  }

  public count() {
    return this.cart.countCart;
  }

}
