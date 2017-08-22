import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { MoviesService } from '../shared/services/movies.service';
import { GamesService } from '../shared/services/games.service';
import { BooksService } from '../shared/services/books.service';
import { HelperService } from '../shared/services/helper.service';
import { Product } from '../shared/models/product.model';

@Component({
  selector: 'app-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  public products: Product[] = [];
  public loading = false;
  public emptySearch = false;

  constructor(private gamesService: GamesService,
              private movieService: MoviesService,
              private bookService: BooksService,
              private router: Router,
              private route: ActivatedRoute,
              private helperService: HelperService) {
  }

  public ngOnInit() {
    this.helperService.showFilters.emit(true);

    this.helperService.updateFilters.subscribe((filters) => {
      filters.q = this.helperService.searchTerm || filters.q;
      if (filters.q || (filters.q.length > 3)) {
        this.router.navigate(['/search'], {queryParams: filters});
      }
    });

    this.route.queryParams.subscribe(() => this.searchProduct());
  };

  public ngOnDestroy() {
    this.helperService.showFilters.emit(false);
  }

  private searchProduct() {
    if (!this.route.snapshot.queryParams.hasOwnProperty('q') || this.route.snapshot.queryParams['q'] === '') {
      this.emptySearch = true;
      this.loading = true;
      return;
    }
    const filters = this.route.snapshot.queryParams;
    this.emptySearch = false;
    this.loading = false;
    this.products = [];
    const gameFilter = {limit: '10'};
    const movieFilter = {limit: '10'};
    if (filters['dateFrom']) {
      movieFilter['primary_release_date.gte'] = filters['dateFrom'].split('-')[0];
    }
    if (filters['dateTo']) {
      movieFilter['primary_release_date.gte'] = filters['dateTo'].split('-')[0];
    }

    const observables = [];
    if (filters.checkBooks) {
      observables.push(this.bookService.search(filters['q']));
    }
    if (filters.checkMovies) {
      observables.push(this.gamesService.search(filters['q'], gameFilter));
    }
    if (filters.checkGames) {
      observables.push(this.movieService.search(filters['q'], movieFilter));
    }
    Observable.forkJoin(observables)
      .map((data) => {
        return [].concat.apply([], data);
      })
      .subscribe((items: Product[]) => {
        this.products = items;
        this.loading = true;
      });
  }

}

