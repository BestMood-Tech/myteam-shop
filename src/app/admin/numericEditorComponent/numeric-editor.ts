import {Component, ViewContainerRef, ViewChild, AfterViewInit} from '@angular/core';

import {AgEditorComponent} from 'ag-grid-ng2/main';

@Component({
  selector: 'app-numeric-cell',
  templateUrl: './numeric-editor.html'
})
export class NumericEditorComponent implements AgEditorComponent, AfterViewInit {
  private params: any;
  public value: number;
  private cancelBeforeStart: boolean = false;

  @ViewChild('input', {read: ViewContainerRef}) public input;


  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.cancelBeforeStart = params.charPress && this.isCharNumeric(params.charPress);
  }

  getValue(): any {
    return this.value;
  }

  isCancelBeforeStart(): boolean {
    return this.cancelBeforeStart;
  }
  isCancelAfterEnd(): boolean {
    return this.value > 1000000;
  };

  onKeyDown(event): void {
    if (!this.isKeyPressedNumeric(event)) {
      if (event.preventDefault) event.preventDefault();
    }
  }
  ngAfterViewInit() {
    this.input.element.nativeElement.focus();
  }

  private getCharCodeFromEvent(event): any {
    event = event || window.event;
    return (typeof event.which === 'undefined') ? event.keyCode : event.which;
  }

  private isCharNumeric(charStr): boolean {
    return !!/\d/.test(charStr);
  }

  private isKeyPressedNumeric(event): boolean {
    if (this.getCharCodeFromEvent(event) === 8) {
      let stringValue = this.value.toString(10);
      if (stringValue.length === 1 ) { this.value = 0;
      } else {
        this.value = parseInt(stringValue.slice(0, stringValue.length - 1), 10);
      }
    }
    let charCode = this.getCharCodeFromEvent(event);
    let charStr = String.fromCharCode(charCode);
    return this.isCharNumeric(charStr);
  }
}
