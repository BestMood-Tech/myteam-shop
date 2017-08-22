import { Component, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';

@Component({
  selector: 'app-numeric-cell',
  templateUrl: 'numeric-editor.html'
})
export class NumericEditorComponent implements AgEditorComponent, AfterViewInit {
  private params: any;
  public value: number;
  private cancelBeforeStart = false;
  @ViewChild('input', { read: ViewContainerRef }) public input;

  public agInit(params: any) {
    this.params = params;
    this.value = this.params.value;
    this.cancelBeforeStart = params.charPress && this.isCharNumeric(params.charPress);
  }

  public getValue() {
    return this.value;
  }

  public isCancelBeforeStart() {
    return this.cancelBeforeStart;
  }

  public isCancelAfterEnd() {
    return this.value > 1000000;
  };

  public onKeyDown(event) {
    if (!this.isKeyPressedNumeric(event)) {
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }

  public ngAfterViewInit() {
    this.input.element.nativeElement.focus();
  }

  private getCharCodeFromEvent(event) {
    event = event || window.event;
    return (typeof event.which === 'undefined') ? event.keyCode : event.which;
  }

  private isCharNumeric(charStr) {
    return !!/\d/.test(charStr);
  }

  private isKeyPressedNumeric(event) {
    if (this.getCharCodeFromEvent(event) === 8) {
      const stringValue = this.value.toString(10);
      if (stringValue.length === 1) {
        this.value = 0;
      } else {
        this.value = parseInt(stringValue.slice(0, stringValue.length - 1), 10);
      }
    }
    const charCode = this.getCharCodeFromEvent(event);
    const charStr = String.fromCharCode(charCode);
    return this.isCharNumeric(charStr);
  }
}
