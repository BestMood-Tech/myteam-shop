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

  @Input() filters;
  @Output() filtersUpdated = new EventEmitter()

  constructor(private _gamesService: GamesService, private fb: FormBuilder) {}

  ngOnInit() {
    this.genres = this._gamesService.getLocalGenres();
    this.filtersForm = this.fb.group({
      movie: [false],
      game: [false],
      music: [false],
      musicGroup: this.fb.group({
        artist: '',
        new: [false],
        hipster: [false]
      }),
      movieGroup: this.fb.group({}),
      gameGroup: this.fb.group({
        genres: '',
        developer: ''
      })
    });
  }

  applyFilters() {

    let form = this.filtersForm.value;

    this.filtersUpdated.emit({
      musicArtis : [
        form.musicGroup.artist,
        form.musicGroup.new,
        form.musicGroup.hipster
      ],
      game: [
        form.gameGroup.genres,
        form.gameGroup.developer
      ]
    });
  }
}
