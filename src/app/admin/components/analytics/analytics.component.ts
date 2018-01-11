import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';

import * as AdminActions from '../../store/admin/admin.action';
import { AdminState, getOrders } from '../../store/admin/admin.state';
import { Order } from '../../../shared/models';

@Component({
  selector: 'app-users',
  templateUrl: 'analytics.component.html',
  styleUrls: ['analytics.component.scss']
})

export class AnalyticsComponent implements OnInit {
  public chartData: any[];
  public pieChartData: number[];
  public labelMonth = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  public pieChartLabels: number[];
  public chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public chartLegend = true;
  public typesOfChart = ['bar', 'line', 'radar'];
  public chartType = this.typesOfChart[0];
  public typesOfPieChart = ['pie', 'doughnut', 'polarArea'];
  public pieChartType = this.typesOfPieChart[0];
  public analyticsForm: FormGroup;
  public yearForm = [2014, 2015, 2016, 2017];

  constructor(private store: Store<AdminState>) {
  }

  public ngOnInit() {
    this.update();
    this.analyticsForm = new FormGroup({
      from: new FormControl('', Validators.required),
      to: new FormControl('', Validators.required)
    });

    this.store.select(getOrders).subscribe((orders: Order[]) => {
      orders.forEach((order: Order) => {
        const date = new Date(order.createdAt);
        const indexChartData = this.chartData.findIndex((itemChart) => itemChart.label === date.getFullYear());
        if (indexChartData === -1) {
          const obj = {
            data: Array.from({ length: this.labelMonth.length }, () => 0),
            label: date.getFullYear()
          };
          obj.data[date.getMonth()] += order.total;

          this.chartData.push(obj);

          this.pieChartData.push(order.total);
          this.pieChartLabels.push(date.getFullYear());
        } else {
          this.chartData[indexChartData].data[date.getMonth()] += order.total;
          this.pieChartData[indexChartData] += order.total;
        }
      });
    });
  }

  public update(fromYear?: string, toYear?: string) {
    this.chartData = [];
    this.pieChartData = [];
    this.pieChartLabels = [];

    this.store.dispatch(new AdminActions.RequestAdminData(fromYear, toYear));
  }

  public toggle() {
    const currentTypeChart = this.typesOfChart.indexOf(this.chartType);
    this.chartType = this.typesOfChart[currentTypeChart + 1] ? this.typesOfChart[currentTypeChart + 1] : this.typesOfChart[0];

    const currentTypePieChart = this.typesOfPieChart.indexOf(this.pieChartType);
    this.pieChartType = this.typesOfPieChart[currentTypePieChart + 1] ?
      this.typesOfPieChart[currentTypePieChart + 1] : this.typesOfPieChart[0];
  }

  public show() {
    if (!this.validDate()) {
      return;
    }
    this.update(this.analyticsForm.value.from, this.analyticsForm.value.to);
  }

  public validDate() {
    return this.analyticsForm.valid && (this.analyticsForm.value.from <= this.analyticsForm.value.to);
  }
}
