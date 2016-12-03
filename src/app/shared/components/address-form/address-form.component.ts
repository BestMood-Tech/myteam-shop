import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core/src/metadata/directives';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {

  @Input() name;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
  }

}
