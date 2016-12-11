import { Component, OnInit } from '@angular/core';
import { AdminService } from '../shared/service/admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  public data: any;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getSelling().subscribe((res) => this.data = res);
  }

}
