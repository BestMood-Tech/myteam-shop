import { Component, OnInit } from '@angular/core';
import { Auth } from '../shared/services/auth.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  constructor(private auth: Auth) { }

  ngOnInit() {

  }

  update(key) {
    console.log(`Обновить запись ${key}`);
  }

  add() {
    console.log(`Добавить адресс`);
  }

  delete(key) {
    console.log(`Удалить запись ${key}`);
  }

}
