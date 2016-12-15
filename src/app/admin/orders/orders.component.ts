import { Component, OnInit } from '@angular/core';
import {GridOptions} from 'ag-grid/main';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public gridOptions: GridOptions;
  public rowData: any[];
  private dataSource: any;

  constructor(private adminService: AdminService) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = this.createColumnDefs();
    this.gridOptions.enableServerSideSorting = true;
    this.gridOptions.rowModelType = 'virtual';
    this.gridOptions.paginationPageSize = 50;
  }

  ngOnInit() {
    this.Update();
  }

  private createColumnDefs() {
    return [
      {
        headerName: 'Number of goods',
        field: 'numberGoods',
        editable: true,
        width: 150
      },
      {
        headerName: 'Total',
        field: 'total',
        editable: true,
        width: 100
      },
      {
        headerName: 'Promo Code',
        field: 'promoCode',
        editable: true,
        width: 150
      },
      {
        headerName: 'Payment',
        sort: 'desc',
        field: 'payment',
        editable: true,
        width: 150
      },
      {
        headerName: 'Address',
        field: 'address',
        width: 600,
        editable: true
      },
      {
        headerName: 'Date',
        field: 'date',
        editable: true,
        width: 200
      }
    ];
  }

  public Update() {
    this.rowData = [];
    this.adminService.getSelling().subscribe((res) => {
      res.forEach((item) => {
        this.rowData.push({
          numberGoods: item.orders.length,
          total: item.total,
          promoCode: item.formProfile.promoCode,
          payment: item.formProfile.payment,
          address: JSON.stringify(`${item.addressOrder.streetAddress} 
                    ${item.addressOrder.addressLine2}
                    ${item.addressOrder.city}
                    ${item.addressOrder.state}
                    ${item.addressOrder.zip}
                    ${item.addressOrder.country}`),
          date: item.date
        });
      });
      this.dataSource = {
        rowCount: null,
        getRows: (params) => {
          let rowDataAfterSorting = this.sortData(params.sortModel, this.rowData);
          let rowsThisPage = rowDataAfterSorting.slice(params.startRow, params.endRow);
          let lastRow = -1;
          if (this.rowData.length <= params.endRow) {
            lastRow = this.rowData.length;
          }
          params.successCallback(rowsThisPage, lastRow);
        }
      };
      this.gridOptions.rowData = this.rowData;
    });
  }

  private sortData(sortModel, data) {
    let sortPresent = sortModel && sortModel.length > 0;
    if (!sortPresent) {
      return data;
    }

    let resultOfSort = data.slice();
    resultOfSort.sort(function(a, b) {
      for (let k = 0; k < sortModel.length; k++) {
        let sortColModel = sortModel[k];
        let valueA = a[sortColModel.colId];
        let valueB = b[sortColModel.colId];
        if (valueA === valueB) {
          continue;
        }
        let sortDirection = sortColModel.sort === 'asc' ? 1 : -1;
        if (valueA > valueB) {
          return sortDirection;
        } else {
          return sortDirection * -1;
        }
      }
      return 0;
    });
    return resultOfSort;

  }
  public saveTable() {
    console.log(this.gridOptions.rowData);
  }
}
