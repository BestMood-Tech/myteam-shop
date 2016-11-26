import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from './shared/services/movie.service';
import { Auth } from './shared/services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private router: Router, private movie:MovieService, private auth: Auth) {
    }

    ngOnInit() {
      //this.movie.latest().subscribe(res => console.log(res), err => console.log(err));
      this.movie.search("kung fu panda",{page: 1, year: 2016}).subscribe(res => console.log(res), err => console.log(err));
      //this.movie.getItem(3).subscribe(res => console.log(res), err => console.log(err));
    }

    search() {
        this.router.navigate(['/search']);
    }
}
