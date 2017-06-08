import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GamesService } from '../../services/';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  public genres: any;
  public filtersForm: FormGroup;
  public categoryIsSelected: any;
  @Input() public filters: any;
  @Output() public filtersUpdated: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  public ngOnInit() {
    this.filtersForm = this.fb.group({
      gameGroup: this.fb.group({
        genres: this.filters.genres || '',
        developer: this.filters.developer || ''
      })
    });
  }

  public applyFilters() {
    let form = this.filtersForm.value;
    let filterObject = {};
    if (form.movie) filterObject['movie'] = form.movie;
    if (form.game) filterObject['game'] = form.game;
    if (!!form.gameGroup.genres) filterObject['genres'] = form.gameGroup.genres;
    this.filtersUpdated.emit(filterObject);
  }
}
