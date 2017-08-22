import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ratio',
  template: `
    <ul class="list-unstyled lines" *ngIf="!isEdit">
      <li class="line" *ngFor="let item of rationAsAnArray"></li>
      <li class="line empty" *ngFor="let item of emptyRatio"></li>
    </ul>
    <ul class="list-unstyled lines" *ngIf="isEdit">
      <li class="line edit" *ngFor="let item of editArray" [ngClass]="{empty: item > rate}"
          (click)="setRate(item)"></li>
    </ul>
    <div class="rates">
      {{rate}} / 5
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

    .edit {
      cursor: pointer;
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
  @Input() public isEdit: boolean;
  @Input() public rate: any;
  @Output('onChange') public onChange: EventEmitter<number> = new EventEmitter();
  public rationAsAnArray: any[];
  public emptyRatio: any[] = [];
  public editArray: any[] = [1, 2, 3, 4, 5];

  constructor() {
  }

  public ngOnInit() {
    this.culcRations();
  }

  public ngOnChanges(changes) {
    if (changes.rate) {
      this.culcRations();
    }
  }

  private culcRations() {
    this.rate = parseFloat(this.rate) > 5 ? (parseFloat(this.rate) / 2).toFixed(1) : parseFloat(this.rate).toFixed(1);
    this.rate = this.isEdit ? parseInt(this.rate, 10) : this.rate;
    this.rationAsAnArray = new Array(Math.floor(this.rate));
    if (this.rationAsAnArray && this.rationAsAnArray.length <= 5) {
      this.emptyRatio.length = 5 - this.rationAsAnArray.length;
    }
  }

  public setRate(date) {
    this.rate = date;
    this.onChange.emit(this.rate);
  }
}
