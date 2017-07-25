import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { VideoModalWindowComponent } from '../shared/components/video-modal-window/video.component';
import { Auth, BooksService, GamesService, MovieService } from '../shared/services';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public gameData: any;
  public movieData: any;
  public bookData: any;
  public productCurrency: any;

  constructor(private movieService: MovieService,
              private gamesService: GamesService,
              private booksService: BooksService,
              private auth: Auth,
              private modalService: NgbModal) {
  }

  public ngOnInit() {
    this.gamesService.latest().subscribe(res => {
      this.gameData = this.gamesService.processData(res)[0];
    });
    this.movieService.recent().subscribe(res => {
      this.movieData = this.movieService.processData(res)[0];
    });
    this.booksService.getStories().subscribe((res) => {
      this.bookData = this.booksService.processData(res)[0];
    });
    this.auth.onAuth.subscribe((user: User) => {
      if (!user) {
        return;
      }
      this.productCurrency = user.currency;
    });
    this.auth.getProfile();
  }

  public showTrailer(item) {
    const modalRef = this.modalService.open(VideoModalWindowComponent);
    modalRef.componentInstance.product = item;
    modalRef.result.then((resolve) => null, (error) => null);
  }

}
