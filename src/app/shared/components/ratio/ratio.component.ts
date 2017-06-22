import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-ratio',
  template: `
    <ul class="list-unstyled lines">
      <li class="line" *ngFor="let item of rationAsAnArray"></li>
    </ul>
    <div class="rates">
      {{product.vote}} / 5
    </div>

  `,
  styles: [`
    .lines {
      margin-bottom: 0;
    }

    .line {
      display: inline-block;
      height: 4px;
      width: 25px;
      background: #ffc033;
    }

    .line:not(:last-child) {
      margin-right: 3px;
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
    this.product.vote = this.product.vote > 5 ? (this.product.vote / 2).toFixed(1) : this.product.vote.toFixed(1);
    this.rationAsAnArray = new Array(Math.floor(this.product.vote));
  }
}
