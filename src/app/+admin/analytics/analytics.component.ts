import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AdminService } from '../admin.service';

@Component({
  selector: 'app-users',
  templateUrl: 'analytics.component.html',
  styleUrls: ['analytics.component.scss']
})

export class AnalyticsComponent implements OnInit {

  public chartData: any[];
  public pieChartData: string[];

  public labelMonth: string[] = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  public pieChartLabels: any[];

  public ChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public ChartLegend = true;
  public ChartType = 'bar';
  public pieChartType = 'pie';

  public analyticsForm: FormGroup;
  public yearForm: number[] = [2014, 2015, 2016];


  constructor(private adminService: AdminService, private formBuilder: FormBuilder) {
  }

  public ngOnInit() {
    this.update();

    this.analyticsForm = this.formBuilder.group({
      from: ['', Validators.required],
      to: ['', [Validators.required]]
    });
  }

  public update(fromYear?, toYear?): void {
    this.chartData = [];
    this.pieChartData = [];
    this.pieChartLabels = [];

    this.adminService.getSelling(fromYear, toYear).subscribe((data) => {

      data.forEach((item) => {
        const date = new Date(item.date);

        if (this.isYear(date.getFullYear()) === -1) {

          const obj = { data: this.initData(), label: date.getFullYear() };
          obj.data[date.getMonth()] += item.total;

          this.chartData.push(obj);

          this.pieChartData.push(item.total);
          this.pieChartLabels.push(date.getFullYear());

        } else {

          this.chartData[this.isYear(date.getFullYear())].data[date.getMonth()] += item.total;
          this.pieChartData[this.isYear(date.getFullYear())] += item.total;

        }

      });

    });

  }

  public isEmptyData(): boolean {
    return !!this.chartData.length;
  }

  public toggle(): void {
    switch (this.ChartType) {
      case 'bar':
        this.ChartType = 'line';
        break;
      case 'line':
        this.ChartType = 'radar';
        break;
      case 'radar':
        this.ChartType = 'bar';
        break;
      default:
        this.ChartType = 'line';
        break;
    }

    switch (this.pieChartType) {
      case 'doughnut':
        this.pieChartType = 'pie';
        break;
      case 'pie':
        this.pieChartType = 'polarArea';
        break;
      case 'polarArea':
        this.pieChartType = 'doughnut';
        break;
      default:
        this.pieChartType = 'pie';
        break;
    }
  }

  public show(): void {
    if (!this.validDate()) {
      return;
    }

    this.update(this.analyticsForm.value.from, this.analyticsForm.value.to);
  }

  public validDate(): boolean {
    return this.analyticsForm.valid && (this.analyticsForm.value.from <= this.analyticsForm.value.to);
  }

  private isYear(year): number {
    let key = -1;
    this.chartData.forEach((item, index) => {
      if (item.label === year) {
        key = index;
      }
    });
    return key;
  }

  private initData(): number[] {
    const data = [];

    for (let i = 0; i < this.labelMonth.length; i++) {
      data.push(0);
    }

    return data;
  }
}
