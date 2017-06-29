import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid/src/ts/entities/gridOptions';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public gridOptions: GridOptions;
  public rowData: any[];
  public dataSource: any;

  constructor(private adminService: AdminService) {
    this.gridOptions = <GridOptions>{
      columnDefs: this.createColumnDefs(),
      enableServerSideSorting: true,
      rowModelType: 'infinite',
      paginationPageSize: 50
    };
  }

  public ngOnInit() {
    this.update();
  }

  private createColumnDefs() {
    return [
      {
        headerName: 'Name',
        field: 'name',
        editable: true,
        width: 150,
        cellRenderer: (params) => {
          if (params.data !== undefined) {
            return params.data.name;
          } else {
            return '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>';
          }
        }
      },
      {
        headerName: 'Total',
        field: 'total',
        editable: true,
        width: 100
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
        editable: true,
        suppressSizeToFit: true
      }
    ];
  }

  public update() {
    this.rowData = [];
    this.adminService.getSelling().subscribe((res) => {
      res.forEach((item) => {
        this.rowData.push({
          name: `${item.formProfile.firstName} ${item.formProfile.lastName}`,
          total: item.total,
          payment: item.formProfile.payment,
          address: JSON.stringify(`${item.addressOrder.streetAddress} 
                    ${item.addressOrder.addressLine2}
                    ${item.addressOrder.city}
                    ${item.addressOrder.state}
                    ${item.addressOrder.zip}
                    ${item.addressOrder.country}`)
        });
      });
      this.dataSource = {
        rowCount: null,
        getRows: (params) => {
          const rowDataAfterSorting = this.sortData(params.sortModel, this.rowData);
          const rowsThisPage = rowDataAfterSorting.slice(params.startRow, params.endRow);
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
    const sortPresent = sortModel && sortModel.length > 0;
    if (!sortPresent) {
      return data;
    }

    const resultOfSort = data.slice();
    resultOfSort.sort(function (a, b) {
      for (let k = 0; k < sortModel.length; k++) {
        const sortColModel = sortModel[k];
        const valueA = a[sortColModel.colId];
        const valueB = b[sortColModel.colId];
        if (valueA === valueB) {
          continue;
        }
        const sortDirection = sortColModel.sort === 'asc' ? 1 : -1;
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
