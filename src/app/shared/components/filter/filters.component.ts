import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  constructor(private route: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const filter = new Search(params);
      this.filtersForm = new FormGroup({
        date: new FormControl(filter.date || ''),
        movies: new FormControl(filter.movies),
        games: new FormControl(filter.games),
        books: new FormControl(filter.books),
        query: new FormControl(filter.query)
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
