import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';

import { Product } from '../shared/models';
import { BooksService, GamesService, HelperService, MoviesService } from '../shared/services';
import { Search } from '../shared/helper';

@Component({
  selector: 'app-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  public products: Product[] = [];
  public isLoaded = false;
  public isEmptySearch = false;

  constructor(private gamesService: GamesService,
              private movieService: MoviesService,
              private bookService: BooksService,
              private route: ActivatedRoute,
              private helperService: HelperService) {
  }

  public ngOnInit() {
    this.helperService.showFilters.emit(true);
    this.route.queryParams.subscribe((params) => this.searchProduct(new Search(params)));
  };

  public ngOnDestroy() {
    this.helperService.showFilters.emit(false);
  }

  private searchProduct(params: Search): void {
    this.products = [];
    if (params.query === '') {
    this.isEmptySearch = true;
    this.isLoaded = true;
      return;
    }
    this.isEmptySearch = false;
    this.isLoaded = false;

    const observables = [];
    if (params.books) {
      observables.push(this.bookService.search(params.query));
    }
    if (params.games) {
      observables.push(this.gamesService.search(params.query, { limit: '10' }));
    }
    if (params.movies) {
      const movieFilter = { limit: '10' };
      if (params.date) {
        movieFilter['primary_release_year'] = params.date.split('-')[0];
      }
      observables.push(this.movieService.search(params.query, movieFilter));
    }
    Observable.forkJoin(observables)
      .map((data: any[]) => {
        return [].concat.apply([], data);
      })
      .subscribe((items: Product[]) => {
        this.products = items;
        this.isLoaded = true;
      });
  }

}

