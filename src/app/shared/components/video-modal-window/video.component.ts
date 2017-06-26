import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MovieService } from '../../services/movie.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-video-modal-window',
  templateUrl: 'video.component.html',
  styleUrls: ['video.component.scss']
})
export class VideoModalWindowComponent implements OnInit {
  @Input() public idMovie: string;
  public url = 'https://www.youtube.com/embed/';
  public safeUrl: SafeUrl;

  constructor(public activeModal: NgbActiveModal,
              private sanitizer: DomSanitizer,
              private movieService: MovieService) {
  }

  public ngOnInit() {
    this.movieService.getVideos(this.idMovie)
      .subscribe((trailer) => {
        this.url = this.url + trailer.key;
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      });
  }
}
