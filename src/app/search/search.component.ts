///<reference path="../../../node_modules/rxjs/add/operator/isEmpty.d.ts"/>
import { Component, OnInit } from '@angular/core';
import { MovieService } from '../shared/services/movie.service';
import { GamesService } from '../shared/services/games.service';
import { MusicService } from '../shared/services/music.service';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';


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
              private _movieService: MovieService) {
  }

  ngOnInit() {
    this.term.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => {
        if(term) {
          this.products = [];

          return this._musicService.search(term, { limit: '10' }).merge(
            this._gamesService.search(term, { limit: '10' }),
            this._movieService.search(term, { limit: '10' })
          );
        }
        return;
      })
      .subscribe(items => {
        if(items.albums) {
          this.products = this.products.concat(this._musicService.processData(items));
          return;
        };
        if(items.results) {
          this.products = this.products.concat(this._movieService.processData(items));
          return;
        };
        this.products = this.products.concat(this._gamesService.processData(items));
        console.log(this.products);
      });
  };
}

