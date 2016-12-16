import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
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

  public ChartLegend: boolean = true;
  public ChartType: string = 'bar';
  public pieChartType: string = 'pie';

  public analyticsForm: FormGroup;
  public yearForm: number[] = [2014, 2015, 2016];


  constructor(private adminService: AdminService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.update();

    this.analyticsForm = this.formBuilder.group({
      from: ['', Validators.required],
      to: ['', [Validators.required]]
    });


  }

  update(fromYear?, toYear?) {
    this.chartData = [];
    this.pieChartData = [];
    this.pieChartLabels = [];

    this.adminService.getSelling(fromYear, toYear).subscribe((res) => {

      res.forEach((item) => {
        let date = new Date(item.date);

        if (this.isYear(date.getFullYear()) === -1) {

          let obj = { data: this.initData(), label: date.getFullYear() };
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

  private isYear(year): number {
    let key = -1;
    this.chartData.forEach((item, index) => {
      if (item.label === year) {
        key = index;
      }
    });
    return key;
  }

  private initData() {
    let data = [];

    for (let i = 0; i < this.labelMonth.length; i++) {
      data.push(0);
    }

    return data;
  }

  public isEmptyData() {
    return !!this.chartData.length;
  }

  public toggle() {
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

  public show() {
    if (!this.validDate()) return;

    this.update(this.analyticsForm.value.from, this.analyticsForm.value.to);
  }

  public validDate(): boolean {
    return this.analyticsForm.valid && (this.analyticsForm.value.from <= this.analyticsForm.value.to);
  }

}
