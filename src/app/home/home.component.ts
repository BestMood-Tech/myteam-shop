import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { VideoModalWindowComponent } from '../shared/components/video-modal-window/video.component';
import { Product } from '../shared/models';
import { BooksService, GamesService, MoviesService } from '../shared/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public gameData: Product;
  public movieData: Product;
  public bookData: Product;

  constructor(private movieService: MoviesService,
              private gamesService: GamesService,
              private booksService: BooksService,
              private modalService: NgbModal) {
  }

  public ngOnInit() {
    this.gamesService.getItems().subscribe((games: Product[]) => {
      this.gameData = games[0];
    });
    this.movieService.getItems().subscribe((movies: Product[]) => {
      this.movieData = movies[0];
    });
    this.booksService.getItems().subscribe((books: Product[]) => {
      this.bookData = books[0];
    });
  }

  public showTrailer(item) {
    const modalRef = this.modalService.open(VideoModalWindowComponent);
    modalRef.componentInstance.product = item;
    modalRef.result.then((resolve) => null, (error) => null);
  }

}
