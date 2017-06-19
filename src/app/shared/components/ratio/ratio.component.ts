import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ratio',
  template: `
    <ul class="list-unstyled lines">
      <li class="line" *ngFor="let item of rationAsAnArray"></li>
    </ul>
    <div class="rates">
      {{ratio}} / 5
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

  `],
})
export class RatioComponent implements OnInit {

  @Input() public ratio: number;
  public rationAsAnArray: any[];

  constructor() {
  }

  ngOnInit() {
    this.ratio = this.ratio > 5 ? this.ratio / 2 : this.ratio;
    this.rationAsAnArray = new Array(Math.floor(this.ratio));
  }
}
