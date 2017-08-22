import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Search } from '../../helper';

@Component({
  selector: 'app-filters',
  templateUrl: 'filters.component.html',
  styleUrls: ['filters.component.scss']
})
export class FiltersComponent implements OnInit {
  public filtersForm: FormGroup;
  public display = true;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const filter = new Search(params);
      this.filtersForm = this.fb.group({
        date: filter.date || '',
        movies: filter.movies,
        games: filter.games,
        books: filter.books,
        query: filter.query
      });
    });
  }

  public applyFilters(): void {
    const filters = this.filtersForm.value;
    if (!filters.date) {
      delete filters.date;
    }
    this.router.navigate(['/search'], { queryParams: filters })
  }

}
