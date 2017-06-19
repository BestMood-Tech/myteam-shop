import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HelperService } from '../../services/helper.service';
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  public genres: any;
  public filtersForm: FormGroup;
  public display = true;
  public filters: any;
  // @Output() public filtersUpdated: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder,
              private helperService: HelperService,
              private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.filters = this.route.snapshot.queryParams;
    this.filtersForm = this.fb.group({
      dateFrom: this.filters.dateFrom || '',
      dateTo: this.filters.dateTo || '',
      gameGroup: this.fb.group({
        genres: this.filters.genres || '',
        developer: this.filters.developer || ''
      }),
      checkMovies: this.filters.checkMovies || true,
      checkGames: this.filters.checkGames || true,
      checkBooks: this.filters.checkBooks || true,
    });
  }

  public applyFilters() {
    const form = this.filtersForm.value;
    const filterObject = {};
    if (form.dateFrom) filterObject['dateFrom'] = form.dateFrom;
    if (form.dateTo) filterObject['dateTo'] = form.dateTo;
    if (form.movie) filterObject['movie'] = form.movie;
    if (form.game) filterObject['game'] = form.game;
    if (form.checkGames) filterObject['checkGames'] = form.checkGames;
    if (form.checkMovies) filterObject['checkMovies'] = form.checkMovies;
    if (form.checkBooks) filterObject['checkBooks'] = form.checkBooks;
    if (!!form.gameGroup.genres) filterObject['genres'] = form.gameGroup.genres;
    this.helperService.updateFilters.emit(filterObject);
    // this.filtersUpdated.emit(filterObject);
  }

  public inverseDisplay() {
    this.display = !this.display;
  }
}
