import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../shared/services/movie.service';
import { GamesService } from '../shared/services/games.service';
import { MusicService } from '../shared/services/music.service';
import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public term: FormControl;
  products = [];

  constructor(private _musicService: MusicService,
              private _gamesService: GamesService,
              private _movieService: MovieService,
              private _router: Router,
              private _route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log(this._route.snapshot.queryParams);
    this.term = new FormControl(this._route.snapshot.queryParams['q']);
    this._route.queryParams
      .switchMap(({ q }) => {
        return Observable.forkJoin([
          this._musicService.search(q, { limit: '10' }),
          this._gamesService.search(q, { limit: '10' }),
          this._movieService.search(q, { limit: '10' })
        ]);
      })
      .map(([music, games, movies]) => {
        return [].concat(
          this._musicService.processData(music),
          this._gamesService.processData(games),
          this._movieService.processData(movies));
      })
      .subscribe(items => {
        this.products = items;
      });

    this.term.valueChanges
      .debounceTime(500)
      .filter(item => item && item.length > 3)
      .distinctUntilChanged()
      .subscribe(term => {
        this._router.navigate(['/search'], {queryParams: { q: term }});
      });
  };

  filtersUpdated(filters) {
    console.log(filters)
    this._router.navigate(['/search'], {queryParams: { q: this.term.value, music: filters.music, game: filters.game }});
  }
}

