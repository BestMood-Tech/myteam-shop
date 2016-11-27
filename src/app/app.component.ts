import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from './shared/services/movie.service';
import { Auth } from './shared/services/auth.service';
import { GamesService } from './shared/services/games.service';
import { MusicService } from './shared/services/music.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(private router: Router, private movie: MovieService, private auth: Auth,
              private _gamesService: GamesService, private _musicService: MusicService) {
  }

  ngOnInit() {
    // this.movie.recent().subscribe(res => console.log(res), err => console.log(err));
    // this.movie.search("kung fu panda", {
    //   page: 1,
    //   year: 2016
    // }).subscribe(res => console.log(res), err => console.log(err));
    // this.movie.getItem(3).subscribe(res => console.log(res), err => console.log(err));
    //
    // this._gamesService.getIt'em(85).subscribe(res => console.log(res), err => console.log(err));
    // this._gamesService.latest().subscribe(res => console.log(res), err => console.log(err));
    // this._gamesService.search('zelda', {
    //     genres: 8
    // }).subscribe(res => console.log(res), err => console.log(err));
    this._musicService.getItem('0sNOF9WDwhWunNAHPD3Baj').subscribe(res => console.log(res), err => console.log(err));
    this._musicService.search('', { artist: 'Disturbed', year: '2015' })
      .subscribe(res => console.log(res), err => console.log(err));
    this._musicService.latest().subscribe(res => console.log(res), err => console.log(err));
  }

  search() {
    this.router.navigate(['/search']);
  }
}
