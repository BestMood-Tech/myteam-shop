import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from './shared/services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private router: Router, private auth: Auth) {
    }

    search() {
        this.router.navigate(['/search']);
    }
}
