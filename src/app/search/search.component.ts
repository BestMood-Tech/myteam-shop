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
    this.term = new FormControl(this.route.snapshot.params['q']);
    this.route.params
      .switchMap(({ q }) => {
        return Observable.forkJoin([
          this.bookService.search(q),
          this.gamesService.search(q, { limit: '10' }),
          this.movieService.search(q, { limit: '10' })
        ]);
      })
      .map(([books, games, movies]) => {
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
      .filter(item => item && item.length > 3)
      .distinctUntilChanged()
      .subscribe(term => {
        this.router.navigate(['/search', { q: term }])
      });
  };

  public filtersUpdated(filters) {
    filters['q'] = this.term.value;
    this.router.navigate(['/search'], {queryParams: filters});
  }
}

