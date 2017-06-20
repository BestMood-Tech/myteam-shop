import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../shared/services/movie.service';
import { GamesService } from '../shared/services/games.service';
import { BooksService } from '../shared/services/books.service';
import { Observable } from 'rxjs/Rx';
import { HelperService } from '../shared/services/helper.service';
import dragscroll from 'dragscroll';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  // public term: FormControl;
  public products = [];
  public loading = false;
  // public params = this.route.snapshot.queryParams;

  constructor(private gamesService: GamesService,
              private movieService: MovieService,
              private bookService: BooksService,
              private router: Router,
              private route: ActivatedRoute,
              private helperService: HelperService) {
  }

  public ngOnInit() {
    this.helperService.showFilters.emit(true);
    this.helperService.updateFilters.subscribe((filters) => {
      filters['q'] = this.helperService.searchTerm;
      this.router.navigate(['/search'], {queryParams: filters});
    });
    const objState = {
      checkMovies: true,
      checkBooks: true,
      checkGames: true
    };

    // this.term = new FormControl(this.route.snapshot.queryParams['q']);
    this.route.queryParams
      .switchMap((filters) => {
        this.loading = false;
        this.products = [];
        const gameFilter = {limit: '10'};
        const movieFilter = {limit: '10'};
        if (filters['genres']) {
          gameFilter['genres'] = filters['genres'];
        }
        if (filters['dateFrom']) {
          movieFilter['primary_release_date.gte'] = filters['dateFrom'].split('-')[0];
        }
        if (filters['dateTo']) {
          movieFilter['primary_release_date.gte'] = filters['dateTo'].split('-')[0];
        }
        Object.keys(objState).forEach((nameField) => objState[nameField] = filters[nameField]);
        return Observable.forkJoin([
          this.bookService.search(filters['q']),
          this.gamesService.search(filters['q'], gameFilter),
          this.movieService.search(filters['q'], movieFilter)
        ]);
      })
      .map(([books, games, movies]) => {
        if (!objState.checkBooks) {
          books.stories = [];
        }
        if (!objState.checkMovies) {
          movies.results = [];
        }
        if (!objState.checkGames) {
          games = [];
        }
        return [].concat(
          this.bookService.processData(books),
          this.gamesService.processData(games),
          this.movieService.processData(movies));
      })
      .subscribe(items => {
        this.products = items;
        this.loading = true;
      });

    // this.term.valueChanges
    //   .debounceTime(500)
    //   .distinctUntilChanged()
    //   .subscribe(term => {
    //     const object = {};
    //     for (const value of Object.keys(this.route.snapshot.queryParams)) {
    //       object[value] = this.route.snapshot.queryParams[value];
    //     }
    //     object['q'] = term;
    //     this.router.navigate(['/search'], {queryParams: object});
    //   });
    dragscroll.reset();
  };

  public ngOnDestroy() {
    this.helperService.showFilters.emit(false);
  }

  // public filtersUpdated(filters) {
  //   filters['q'] = this.term.value;
  //   this.router.navigate(['/search'], {queryParams: filters});
  // }
}

