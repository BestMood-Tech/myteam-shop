import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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


  term = new FormControl();
  products = [];

  constructor(private _musicService: MusicService,
              private _gamesService: GamesService,
              private _movieService: MovieService,
              private _router: ActivatedRoute) {
  }

  ngOnInit() {
    this.term.setValue(this._router.snapshot.params['q']);
    this._router.params
      .filter(term => term['q'] && term['q'].length > 3)
      .switchMap(term => {
        return Observable.forkJoin([
          this._musicService.search(term['q'], { limit: '10' }),
          this._gamesService.search(term['q'], { limit: '10' }),
          this._movieService.search(term['q'], { limit: '10' })
        ]);
    })
      .subscribe(items => {
        console.log(items);
        this.products = [];
        this.products = this.products.concat(this._musicService.processData(items[0]),
          this._gamesService.processData(items[1]),
          this._movieService.processData(items[2]));
        console.log(this.products);
      });
    this.term.valueChanges
      .debounceTime(500)
      .filter(item => item && item.length > 3)
      .distinctUntilChanged()
      .mergeMap(term => {
        return Observable.forkJoin([
            this._musicService.search(term, { limit: '10' }),
            this._gamesService.search(term, { limit: '10' }),
            this._movieService.search(term, { limit: '10' })
          ]);
      })
      .subscribe(items => {
        console.log(items);
        this.products = [];
        this.products = this.products.concat(this._musicService.processData(items[0]),
          this._gamesService.processData(items[1]),
          this._movieService.processData(items[2]));
        console.log(this.products);
      });
  };
}

