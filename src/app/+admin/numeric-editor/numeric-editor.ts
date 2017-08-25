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

  static isCharNumeric(charStr) {
    return /\d/.test(charStr);
  }

  static getCharCodeFromEvent(event) {
    event = event || window.event;
    return (typeof event.which === 'undefined') ? event.keyCode : event.which;
  }

  public agInit(params: any) {
    this.params = params;
    this.value = this.params.value;
    this.cancelBeforeStart = params.charPress && NumericEditorComponent.isCharNumeric(params.charPress);
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
    if (this.isKeyPressedNumeric(event) && !event.preventDefault) {
      return;
    }
    event.preventDefault();
  }

  public ngAfterViewInit() {
    this.input.element.nativeElement.focus();
  }

  private isKeyPressedNumeric(event) {
    if (NumericEditorComponent.getCharCodeFromEvent(event) === 8) {
      const stringValue = this.value.toString(10);
      this.value = stringValue.length === 1 ? 0 : parseInt(stringValue.slice(0, stringValue.length - 1), 10);
    }
    const charCode = NumericEditorComponent.getCharCodeFromEvent(event);
    const charStr = String.fromCharCode(charCode);
    return NumericEditorComponent.isCharNumeric(charStr);
  }
}
