import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../shared/services/movie.service';
import { GamesService } from '../shared/services/games.service';
import { Observable } from 'rxjs/Rx';
import { BooksService } from '../shared/services/books.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public term: FormControl;
  public products = [];
  public params = this.route.snapshot.queryParams;

  constructor(private gamesService: GamesService,
              private movieService: MovieService,
              private bookService: BooksService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  public ngOnInit() {
    let objState = {
      checkMovies: true,
      checkBooks: true,
      checkGames: true
    };

    this.term = new FormControl(this.route.snapshot.queryParams['q']);
    this.route.queryParams
      .switchMap((filters) => {
        let gameFilter = {limit: '10'};
        let movieFilter = { limit: '10'};
        if (filters['genres']) gameFilter['genres'] = filters['genres'];
        if (filters['dateFrom']) movieFilter['primary_release_date.gte'] = filters['dateFrom'].split('-')[0];
        if (filters['dateTo']) movieFilter['primary_release_date.gte'] = filters['dateTo'].split('-')[0];
        Object.keys(objState).forEach((nameField) => objState[nameField] = filters[nameField]);
        return Observable.forkJoin([
          this.bookService.search(filters['q']),
          this.gamesService.search(filters['q'], gameFilter),
          this.movieService.search(filters['q'], movieFilter)
        ]);
      })
      .map(([books, games, movies]) => {
        if (!objState.checkBooks) books.stories = [];
        if (!objState.checkMovies) movies.results = [];
        if (!objState.checkGames) games = [];
        return [].concat(
          this.bookService.processData(books),
          this.gamesService.processData(games),
          this.movieService.processData(movies));
      })
      .subscribe(items => {
        this.products = items;
      });

    this.term.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(term => {
        let object = {};
        for (let value of Object.keys(this.route.snapshot.queryParams)) {
          object[value] = this.route.snapshot.queryParams[value];
        }
        object['q'] = term;
        this.router.navigate(['/search'], {queryParams: object});
      });

  };

  public filtersUpdated(filters) {
    console.log(filters);
    filters['q'] = this.term.value;
    this.router.navigate(['/search'], {queryParams: filters});
  }
}

