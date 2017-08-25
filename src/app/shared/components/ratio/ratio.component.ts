import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ratio',
  templateUrl: 'ratio.component.html',
  styleUrls: ['ratio.component.scss']
})
export class RatioComponent implements OnInit, OnChanges {
  @Input() public isEdit: boolean;
  @Input() public rate: any;
  @Output() public onChange: EventEmitter<number> = new EventEmitter();
  public rationAsAnArray: number[];
  public emptyRatio: number[] = [];
  public editArray: number[] = [1, 2, 3, 4, 5];

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

  private culcRations(): void {
    this.rate = parseFloat(this.rate) > 5 ? (parseFloat(this.rate) / 2).toFixed(1) : parseFloat(this.rate).toFixed(1);
    this.rate = this.isEdit ? parseInt(this.rate, 10) : this.rate;
    this.rationAsAnArray = new Array(Math.floor(this.rate));
    if (this.rationAsAnArray && this.rationAsAnArray.length <= 5) {
      this.emptyRatio.length = 5 - this.rationAsAnArray.length;
    }
  }

  public setRate(data): void {
    this.rate = data;
    this.onChange.emit(this.rate);
  }
}
