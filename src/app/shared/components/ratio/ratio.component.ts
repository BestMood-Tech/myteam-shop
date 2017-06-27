import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-ratio',
  template: `
    <ul class="list-unstyled lines">
      <li class="line" *ngFor="let item of rationAsAnArray">
      </li>
      <li class="line empty" *ngFor="let item of emptyRatio"></li>
    </ul>
    <div class="rates">
      {{product.vote}} / 5
    </div>

  `,
  styles: [`
    .lines {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 0;
      margin-top: 15px;
    }

    .line {
      height: 4px;
      width: 25px;
      background: #ffc033;
    }

    .line:not(:last-child) {
      margin-right: 3px;
    }

    .empty {
      background: #ffecc1;
    }

    .rates {
      font-size: 16px;
      color: #ffc033;
    }

  `]
})
export class RatioComponent implements OnInit, OnChanges {

  @Input() public product: any;
  public rationAsAnArray: any[];
  public emptyRatio: any[] = [];

  constructor() {
  }

  public ngOnInit() {
    this.culcRations();
  }

  public ngOnChanges(changes) {
    if (changes.product && !changes.product.firstChange) {
      this.culcRations();
    }
  }

  private culcRations() {
    this.product.vote = parseFloat(this.product.vote) > 5 ? (parseFloat(this.product.vote) / 2).toFixed(1) :
      parseFloat(this.product.vote).toFixed(1);
    this.rationAsAnArray = new Array(Math.floor(this.product.vote));
    if (this.rationAsAnArray && this.rationAsAnArray.length < 5) {
      this.emptyRatio.length = 5 - this.rationAsAnArray.length;
    }
  }
}
