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
  params = this._route.snapshot.queryParams

  constructor(private _musicService: MusicService,
              private _gamesService: GamesService,
              private _movieService: MovieService,
              private _router: Router,
              private _route: ActivatedRoute) {
  }

  ngOnInit() {
    this.term = new FormControl(this._route.snapshot.queryParams['q']);
    this._route.queryParams
      .switchMap( filters => {
        let musicFilter = {limit: '10'};
        let gameFilter = {limit: '10'};
        if (filters['artist']) musicFilter['artist'] = filters['artist'];
        if (filters['new']) musicFilter['new'] = filters['new'];
        if (filters['hipster']) musicFilter['hipster'] = filters['hipster'];
        if (filters['genres']) gameFilter['genres'] = filters['genres'];
        if (filters['date']) {
          musicFilter['year'] = filters['date'].split('-')[0];
          gameFilter['dates'] = filters['date'];
        }
        return Observable.forkJoin([
          this._musicService.search(filters['q'], musicFilter),
          this._gamesService.search(filters['q'], gameFilter),
          this._movieService.search(filters['q'], { limit: '10' })
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
        let object = {};
        for (let value of Object.keys(this._route.snapshot.queryParams)) {
          object[value] = this._route.snapshot.queryParams[value];
        }
        object['q'] = term;
        this._router.navigate(['/search'], {queryParams: object});
      });
  };

  filtersUpdated(filters) {
    filters['q'] = this.term.value;
    this._router.navigate(['/search'], {queryParams: filters});
  }
}

