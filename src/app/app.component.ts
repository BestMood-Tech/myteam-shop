import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from './shared/services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(private router: Router, private auth: Auth) {
  }

  ngOnInit() {

  }

  search() {
    this.router.navigate(['/search']);
  }
}
