import { Component, OnInit } from '@angular/core';

import { GridOptions } from 'ag-grid/src/ts/entities/gridOptions';
import { Store } from '@ngrx/store';

import { Order } from '../../../shared/models';
import { NumericEditorComponent } from '../numeric-editor/numeric-editor.component';
import { AdminState, getOrders } from '../../store/admin/admin.state';
import * as AdminActions from '../../store/admin/admin.action';

interface RowData {
  numberGoods: number;
  total: number;
  payment: string;
  promoCode: string;
  address: string;
  date: Date;
}

@Component({
  selector: 'app-users',
  templateUrl: 'orders.component.html',
  styleUrls: ['orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public gridOptions: GridOptions;
  public rowData: RowData[];
  public dataSource: any;
  public arrayTheme = [
    { name: 'None', theme: '' },
    { name: 'Fresh', theme: 'ag-fresh' },
    { name: 'Dark', theme: 'ag-dark' },
    { name: 'Bootstrap', theme: 'ag-bootstrap' },
    { name: 'Blue', theme: 'ag-blue' },
    { name: 'Material', theme: 'ag-material' }
  ];
  public currentTheme = this.arrayTheme[2];

  constructor(private store: Store<AdminState>) {
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
    this.rowData = [];
    this.store.select(getOrders).subscribe((orders: Order[]) => {
      orders.forEach((item) => {
        this.rowData.push({
          numberGoods: item.products.length,
          total: item.total,
          promoCode: item.promocode,
          payment: item.payment,
          address: item.addressOrder ? JSON.stringify(`${item.addressOrder.streetAddress}
                    ${item.addressOrder.addressLine2}
                    ${item.addressOrder.city}
                    ${item.addressOrder.state}
                    ${item.addressOrder.zip}
                    ${item.addressOrder.country}`) : '',
          date: item.createdAt
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

    this.store.dispatch(new AdminActions.RequestAdminData());
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

  public sortAndFilter(allOfTheData, sortModel, filterModel) {
    return this.sortData(sortModel, this.filterData(filterModel, allOfTheData));
  }

  private sortData(sortModel, data) {
    if (!sortModel || sortModel.length <= 0) {
      return data;
    }
    const sortColModel = sortModel[0];
    return data.sort((a, b) => {
      const sortDirection = sortColModel.sort === 'asc' ? 1 : -1;
      return a[sortColModel.colId] > b[sortColModel.colId] ? sortDirection : sortDirection * -1;
    });
  }

  public filterData(filterModel, data) {
    if (!filterModel || !Object.keys(filterModel).length) {
      return data;
    }
    const resultOfFilter = [];
    const fieldFilter = Object.keys(filterModel);
    fieldFilter.forEach(field => {
      data.forEach((item) => {
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
            const myReverse = (str) => {
              return str.split('').reverse().join();
            };
            if (myReverse(item[field].toString()).indexOf(myReverse(filterTotal)) !== 0) {
              return;
            }
          }
            break;
        }
        resultOfFilter.push(item);
      });
    });
    return resultOfFilter;
  }

  public saveTable() {
    console.log(this.gridOptions.rowData);
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
