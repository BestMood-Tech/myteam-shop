import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from './shared/services/movie.service';
import { Auth } from './shared/services/auth.service';
import { GamesService } from './shared/services/games.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(private router: Router, private movie: MovieService, private auth: Auth, private _gamesService: GamesService) {
  }

  ngOnInit() {
    // this.movie.recent().subscribe(res => console.log(res), err => console.log(err));
    // this.movie.search("kung fu panda", {
    //   page: 1,
    //   year: 2016
    // }).subscribe(res => console.log(res), err => console.log(err));
    // this.movie.getItem(3).subscribe(res => console.log(res), err => console.log(err));
    //
    this._gamesService.getItem(85).subscribe(res => console.log(res), err => console.log(err));
    this._gamesService.latest().subscribe(res => console.log(res), err => console.log(err));
    this._gamesService.search('zelda', {
      genres: 8
    }).subscribe(res => console.log(res), err => console.log(err));
  }

  search() {
    this.router.navigate(['/search']);
  }
}
