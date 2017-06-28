import { Component, OnInit } from '@angular/core';
import { MovieService } from '../shared/services/movie.service';
import { GamesService } from '../shared/services/games.service';
import { Auth } from '../shared/services/auth.service';
import { BooksService } from '../shared/services/books.service';
import { VideoModalWindowComponent } from '../shared/components/video-modal-window/video.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    if (this.auth.user == null) {
      this.productCurrency = '$';
    } else {
      this.productCurrency = this.auth.user.currency;
    }
  }

  public showTrailer(item) {
    const modalRef = this.modalService.open(VideoModalWindowComponent);
    modalRef.componentInstance.product = item;
    modalRef.result.then((resolve) => null, (error) => null);
  }

}
