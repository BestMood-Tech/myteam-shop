import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from '../../shared/models';
import { AdminService } from '../admin.service';

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

  constructor(private adminService: AdminService, private formBuilder: FormBuilder) {
  }

  public ngOnInit() {
    this.update();
    this.analyticsForm = this.formBuilder.group({
      from: ['', Validators.required],
      to: ['', [Validators.required]]
    });
  }

  public update(fromYear?, toYear?) {
    this.chartData = [];
    this.pieChartData = [];
    this.pieChartLabels = [];

    this.adminService.getSelling(fromYear, toYear).subscribe((orders: Order[]) => {
      orders.forEach((item) => {
        const date = new Date(item.createdAt);
        const indexChartData = this.chartData.findIndex((itemChart) => itemChart.label === date.getFullYear());
        if (indexChartData === -1) {
          const obj = {
            data: Array.from({ length: this.labelMonth.length }, () => 0),
            label: date.getFullYear()
          };
          obj.data[date.getMonth()] += item.total;

          this.chartData.push(obj);

          this.pieChartData.push(item.total);
          this.pieChartLabels.push(date.getFullYear());
        } else {
          this.chartData[indexChartData].data[date.getMonth()] += item.total;
          this.pieChartData[indexChartData] += item.total;
        }
      });
    });
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
