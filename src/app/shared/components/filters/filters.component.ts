import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GamesService } from '../../services/';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  genres;
  filtersForm: FormGroup;
  categoryIsSelected;

  @Input() filters;
  @Output() filtersUpdated = new EventEmitter();

  constructor(private _gamesService: GamesService, private fb: FormBuilder) {}

  ngOnInit() {
    this._gamesService.getAllGenres().subscribe(data => {
      setTimeout(() => this.genres = data, 0);
    });

    this.filtersForm = this.fb.group({
      dateFrom: this.filters.dateFrom || '',
      dateTo: this.filters.dateTo || '',
      musicGroup: this.fb.group({
        artist: this.filters.artist || '',
        new: this.filters.new || [false],
        hipster: this.filters.hipster || [false]
      }),
      gameGroup: this.fb.group({
        genres: this.filters.genres || '',
        developer: this.filters.developer || ''
      })
    });
  }

  applyFilters() {

    let form = this.filtersForm.value;
    let filterObject = {};
    if (form.music) filterObject['music'] = form.music;
    if (form.movie) filterObject['movie'] = form.movie;
    if (form.game) filterObject['game'] = form.game;
    if (form.dateFrom) filterObject['dateFrom'] = form.dateFrom;
    if (form.dateTo) filterObject['dateTo'] = form.dateTo;
    if (form.musicGroup.artist) filterObject['artist'] = form.musicGroup.artist;
    if (form.musicGroup.new) filterObject['new'] = form.musicGroup.new;
    if (form.musicGroup.hipster) filterObject['hipster'] = form.musicGroup.hipster;
    if (!!form.gameGroup.genres) filterObject['genres'] = form.gameGroup.genres;
    this.filtersUpdated.emit(filterObject);
  }
}
