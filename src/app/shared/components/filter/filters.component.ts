import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService } from '../../services';


@Component({
  selector: 'app-filters',
  templateUrl: 'filters.component.html',
  styleUrls: ['filters.component.scss']
})
export class FiltersComponent implements OnInit {
  public filtersForm: FormGroup;
  public display = true;
  public filters: any;

  constructor(private fb: FormBuilder,
              private helperService: HelperService,
              private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.route.queryParams.subscribe((queryParams) => {
      this.filters = Object.assign({}, queryParams);
      this.filtersForm = this.fb.group({
        dateFrom: this.filters.dateFrom || '',
        dateTo: this.filters.dateTo || '',
        checkMovies: this.filters.checkMovies,
        checkGames: this.filters.checkGames,
        checkBooks: this.filters.checkBooks,
      });
    });
  }

  public applyFilters() {
    const form = this.filtersForm.value;
    if (form.dateFrom) {
      this.filters.dateFrom = form['dateFrom'];
    }
    if (form.dateTo) {
      this.filters.dateTo = form.dateTo;
    }
    this.filters.checkGames = form.checkGames;
    this.filters.checkMovies = form.checkMovies;
    this.filters.checkBooks = form.checkBooks;
    this.helperService.updateFilters.emit(this.filters);
  }

}
