import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Auth } from './shared/services/auth.service';
import { Cart } from './shared/services/cart.service';
import { AuthGuard } from './shared/services/authGuard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  searchTermForm: FormGroup;
  constructor(private router: Router,
              private cart: Cart,
              private auth: Auth,
              private fb: FormBuilder,
              public authGuard: AuthGuard) {
  }
  ngOnInit() {
    this.searchTermForm = this.fb.group({term: ''});
  }

  search() {
    this.router.navigate(['/search',{q: this.searchTermForm.value.term}]);
    this.searchTermForm.setValue({term: ''});
  }

  count() {
    return this.cart.countCart;
  }

}
