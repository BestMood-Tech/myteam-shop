import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid/src/ts/entities/gridOptions';
import { AdminService } from '../admin.service';
import { NumericEditorComponent } from '../numericEditorComponent/numeric-editor';

@Component({
  selector: 'app-users',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public gridOptions: GridOptions;
  public rowData: any[];
  public dataSource: any;
  public classTheme = 'ag-dark';
  public arrayTheme: string[] = ['None', 'Fresh', 'Dark', 'Bootstrap', 'Blue', 'Material'];

  constructor(private adminService: AdminService) {
    this.gridOptions = <GridOptions>{
      columnDefs: this.createColumnDefs(),
      rowModelType: 'infinite',
      paginationPageSize: 50,
      enableColResize: true,
      enableServerSideSorting: true,
      enableServerSideFilter: true,
      rowHeight: 50,
      rowSelection: 'multiple',
      rowDeselection: true,
      icons: {
        columnGroupOpened: '<i class="glyphicon glyphicon-plus-sign"/>',
        columnGroupClosed: '<i class="glyphicon glyphicon-minus-sign"/>'
      },
      showGrid: true
    };
  }

  public ngOnInit() {
    this.update();
  }

  /*************
   *** Theme ***
   ************/
  public isTheme(key) {
    const arrayClassTheme: string[] = ['', 'ag-fresh', 'ag-dark', 'ag-bootstrap', 'ag-blue', 'ag-material'];
    return arrayClassTheme[key] === this.classTheme;
  }

  public setTheme(key) {
    const arrayClassTheme: string[] = ['', 'ag-fresh', 'ag-dark', 'ag-bootstrap', 'ag-blue', 'ag-material'];
    this.classTheme = arrayClassTheme[key];
  }

  /*************
   ** Ag-grid **
   ************/
  private createColumnDefs() {
    return [
      {
        headerName: '#',
        width: 50,
        checkboxSelection: true,
        cellRenderer: (params) => {
          if (params.data !== undefined) {
            return '';
          } else {
            return '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>';
          }
        }
      },
      {
        headerName: 'Orders',
        children: [
          {
            headerName: 'Number of goods',
            field: 'numberGoods',
            editable: true,
            columnGroupShow: 'closed',
            width: 150,
            cellEditorFramework: NumericEditorComponent,
          },
          {
            headerName: 'Total',
            field: 'total',
            editable: true,
            width: 100,
            cellClassRules: {
              'rag-red': data => {
                return data.value <= 200;
              },
              'rag-amber': data => {
                return data.value < 500 && data.value > 200;
              },
              'rag-green': data => {
                return data.value >= 500;
              },
            },
            cellEditorFramework: NumericEditorComponent
          }
        ]
      },
      {
        headerName: 'Profile',
        children: [
          {
            headerName: 'Promo Code',
            field: 'promoCode',
            editable: true,
            columnGroupShow: 'closed',
            width: 150
          },
          {
            headerName: 'Payment',
            sort: 'desc',
            field: 'payment',
            editable: true,
            width: 150,
            cellEditor: 'select',
            cellEditorParams: {
              values: ['PayPal', 'CreditCard', 'Cash', 'WebMoney', 'QIWI', 'Bitcoin']
            }
          },
          {
            headerName: 'Address',
            field: 'address',
            width: 300,
            columnGroupShow: 'closed',
            editable: true,
            cellStyle: {
              'white-space': 'normal'
            }
          },
          {
            headerName: 'Date',
            field: 'date',
            columnGroupShow: 'closed',
            editable: true,
            width: 200
          }
        ]
      },
    ];
  }

  public update() {
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
          const rowDataAfterSortingAndFilter = this.sortAndFilter(this.rowData, params.sortModel, params.filterModel);
          const rowsThisPage = rowDataAfterSortingAndFilter.slice(params.startRow, params.endRow);
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

  public sortAndFilter(allOfTheData, sortModel, filterModel) {
    return this.sortData(sortModel, this.filterData(filterModel, allOfTheData));
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

  public filterData(filterModel, data) {
    const filterPresent = filterModel && Object.keys(filterModel).length > 0;
    if (!filterPresent) {
      return data;
    }
    const resultOfFilter = [];
    const fieldFilter = Object.keys(filterModel);
    fieldFilter.forEach(field => {
      data.forEach((item) => {
        if (filterModel[field]) {
          const filterTotal = filterModel[field].filter.toString();
          switch (filterModel[field].type) {
            case 'contains':
              if (item[field].toString().indexOf(filterTotal) === -1) {
                return;
              }
              break;
            case 'equals':
              if (item[field].toString() !== filterTotal) {
                return;
              }
              break;
            case 'notEquals':
              if (item[field].toString() === filterTotal) {
                return;
              }
              break;
            case 'startsWith':
              if (item[field].toString().indexOf(filterTotal) !== 0) {
                return;
              }
              break;
            case 'endsWith': {
              const myReverse = function (str) {
                return str.split('').reverse().join();
              };
              if (myReverse(item[field].toString()).indexOf(myReverse(filterTotal)) !== 0) {
                return;
              }
            }
              break;
          }
        }
        resultOfFilter.push(item);
      });
    });
    return resultOfFilter;
  }

  public saveTable() {
    console.log(this.gridOptions.rowData);
  }

  public onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
  }

  public clearPinned() {
    this.gridOptions.columnApi.setColumnsPinned([
      'numberGoods',
      'total',
      'date',
      'promoCode',
      'payment',
      'address'
    ], null);
  }

  public resetPinned() {
    this.gridOptions.columnApi.setColumnsPinned([
      'numberGoods',
      'date'
    ], 'right');
  }

  public pinTotal() {
    this.gridOptions.columnApi.setColumnPinned('total', 'right');
  }

}
