import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from './shared/services/auth.service';
import { Cart } from './shared/services/cart.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(private router: Router, private auth: Auth, private cart: Cart) {
  }

  ngOnInit() {

  }

  search() {
    this.router.navigate(['/search']);
  }

  count() {
    return this.cart.countCart;
  }
}
