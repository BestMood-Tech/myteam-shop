import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Auth } from './shared/services/auth.service';
import { Cart } from './shared/services/cart.service';
import { AuthGuard } from './shared/services/authGuard.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public searchTermForm: FormGroup;
  public navbarCollapsed: boolean;

  constructor(private router: Router,
              private cart: Cart,
              private auth: Auth,
              private fb: FormBuilder,
              public authGuard: AuthGuard,
              private viewContainer: ViewContainerRef,
              private toastr: ToastsManager) {
    this.toastr.setRootViewContainerRef(this.viewContainer);
  }
  public ngOnInit() {
    this.searchTermForm = this.fb.group({term: ''});
  }

  public search() {
    let searchTerm = this.searchTermForm.value.term;
    if ( !searchTerm || !(searchTerm.length > 3)) return;
    let searchObj = {
      q: searchTerm,
      checkMovies: true,
      checkBooks: true,
      checkGames: true
    };
    this.router.navigate(['/search'], { queryParams: searchObj});
    this.searchTermForm.setValue({term: ''});
  }

  public count() {
    return this.cart.countCart;
  }

}
