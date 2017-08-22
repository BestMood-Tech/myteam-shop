import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MoviesService } from '../../services';

@Component({
  selector: 'app-video-modal-window',
  templateUrl: 'video.component.html',
  styleUrls: ['video.component.scss']
})
export class VideoModalWindowComponent implements OnInit {
  @Input() public product: any;
  public url = 'https://www.youtube.com/embed/';
  public safeUrl: SafeUrl;

  constructor(public activeModal: NgbActiveModal,
              private sanitizer: DomSanitizer,
              private movieService: MoviesService) {
  }

  public ngOnInit() {
    if (this.product.type === 'movie') {
      this.movieService.getVideos(this.product.id)
        .subscribe((trailer) => {
          this.url = this.url + trailer.key;
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        });
    } else {
      this.url = this.url + this.product.trailer;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }
  }
}
