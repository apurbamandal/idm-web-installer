import { Component, Input, EventEmitter, Output } from '@angular/core';
import {GetTaskDetails} from "../../shared/services/get-task-details/get-task-details.service";
import {PathConstats} from "../../shared/constants/path-constants";
import { TableConfigObject } from "../../shared/schemas/table-config-schema";
import { ColumnCustomizationSchema, TableRowSchema } from "../../shared/schemas/table-row-schema";
import { EmitterService } from "../../shared/services/emitter/emitter.service";
import { TableRows, EmitSelectedRows,EmitClickedElement} from "../../shared/schemas/table-rows";
import { UIConstants } from "../../shared/constants/ui-constants";
import { LoadingComponent } from "../loading/loading.component";
import { AppLoadingService } from "../../shared/services/loading/app-loading.service";


@Component({
  selector: 'idm-table',
  template: require('./table.html'),
  styles: [require('./table.css')]
})

export class Table{

  check: boolean;

  errorMessage: string;
  TaskList: TableRowSchema;
  @Input("tableConfigObject") tableConfigObject: TableConfigObject;
  @Input("tableName") tableName: string;
  @Output() tableConfigObjectChange = new EventEmitter<TableConfigObject>();
  @Output() onRowSelection? = new EventEmitter();
  ColumnCustomization:ColumnCustomizationSchema;
  isTableLoading=true;
  selectedRows : Array<TableRows> =[];
  checkboxes :Array<boolean> =[];
  selectedRowEmitter;
  elementClickedEmitter;
  showButtons:boolean;
  selectedRowCount : number;
  selectAllCheck:boolean;
  emitSelectedRows:EmitSelectedRows;
  emitClickedElement: EmitClickedElement;
  sortDataEmitter: any;
  tableColumnCustomization: any;

  constructor(private getTaskDetails:GetTaskDetails,public  EmitterService:EmitterService,private appLoadingService: AppLoadingService)  {
      this.eventCreateor();
      this.emitSelectedRows = new EmitSelectedRows();
      this.emitClickedElement = new EmitClickedElement();
  }
  ngOnInit() {

  }
  eventCreateor(){
    this.selectedRowEmitter = this.EmitterService.get("SelectedRows");
    this.elementClickedEmitter = this.EmitterService.get("elementClicked");
    this.sortDataEmitter=this.EmitterService.get("sortBy");
    this.tableColumnCustomization=this.EmitterService.get("tableColumnCustomization");

  }

  isRowsLoading(){
    return this.appLoadingService.TableDataLoading;
  }

  actionButtonClickHandler(event, type) {
    // Multiselect click handler
    this.emitSelectedRows.selectedRows = this.selectedRows;
    this.emitSelectedRows.actionName = type;
    this.selectedRowEmitter.emit(this.emitSelectedRows);
    // tableConfigObject?.columnCustomData?.columns?.length
    //console.log();
  }
  elementClickHandler(row, header) {
    this.emitClickedElement.selectedRows = row;
    this.emitClickedElement.actionName = header;
    this.elementClickedEmitter.emit(this.emitClickedElement);
  }

  IndexOf(superset: TableRows[], subset: TableRows): number {
    for (let i = 0; i < superset.length; i++) {
      if (superset[i].rowId == subset.rowId) {
        return i;
      }
    }

  }

  selectAllRows(isChecked) {
    let totalRows = this.tableConfigObject.tableData.rows.length;
    let indeOfElementw = 0;
    if (isChecked) {
      for (let index = 0; index < totalRows; index++) {
        if (!this.isSelected(this.tableConfigObject.tableData.rows[index])) {
          this.selectedRows.push(this.tableConfigObject.tableData.rows[index]);
        }
      }
    }
    else {
      for (let index = 0; index < totalRows; index++) {
        if (this.isSelected(this.tableConfigObject.tableData.rows[index])) {
          indeOfElementw = this.IndexOf(this.selectedRows, this.tableConfigObject.tableData.rows[index]);
          this.selectedRows.splice(indeOfElementw, 1);
        }
      }

    }
    this.selectedRowCount = this.selectedRows.length;
    this.onRowSelection.emit(this.selectedRows);
  }

  selectRows($event, rows) {
    //this.checkboxes[$event.target.getAttribute('value')]=;
    let indeOfElement = 0;
    if ($event.target.checked) {
      this.selectedRows.push(rows);
    }
    else {
      for (let i = 0; i < this.selectedRows.length; ++i) {
        if (this.selectedRows[i].rowId == rows.rowId) {
          indeOfElement = i;
        }
      }
      this.selectedRows.splice(indeOfElement, 1);
    }
    this.selectedRowCount = this.selectedRows.length;
    this.onRowSelection.emit(this.selectedRows);
  }

  /**
   * taskId has to be changed to row id & which will be send by the api & will be common for all the
   * api which will use the table component (or can be filtered while passing to tthe table )
   * from the parent component
   *
   * @param {any} row
   * @returns {boolean}
   *
   * @memberof Table
   */

  isSelected(row): boolean {
    for (let index = 0; index < this.selectedRows.length; index++) {
      if (this.selectedRows[index].rowId == row.rowId) {
        return true;
      }
    }
    return false;
  }


  showButton() {
    if (this.selectedRows.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  painationEvent ($event: TableConfigObject) {
    this.tableConfigObject = $event;
    this.tableConfigObjectChange.emit(this.tableConfigObject);
  }

  showPagination () {
    return this.tableConfigObject != undefined && this.tableConfigObject.tableData != undefined
            && this.tableConfigObject.tableData.rows != undefined && this.tableConfigObject.tableData.rows.length != 0;
  }

  showPaginationLoader () {
    return this.tableConfigObject != undefined && this.tableConfigObject.tableData != undefined;
  }

  isAllSelected(): boolean {
    let count = 0;
    if (this.tableConfigObject.tableData) {
      for (let rows of this.tableConfigObject.tableData.rows) {
        for (let selectedIndex of this.selectedRows) {
          //if (selectedIndex.rowId == rows.rowId) {
          if (selectedIndex.rowId == rows.rowId) {
            count++;
          }

        }
      }
      if (count == this.tableConfigObject.tableData.rows.length) {
        return true;
      } else {
        return false;
      }
    }

  }

  /**
   *
   *Stablesorting logic can go here
   * @param {any} sortBY
   *
   * @memberOf Table
   */
  sortBY(sortBY) {
    this.sortDataEmitter.emit(sortBY);

  }
  isSortable(header){
    for (var object of this.tableConfigObject.columnCustomData.columns) {
      if (object.hasOwnProperty('isclickable')) {
        if(header==object.column)
          {
            return object.isclickable;
          }
        
      }
    }
   // this.tableConfigObject.columnCustomData.columns
  }
  columnCustomization(){
     this.tableColumnCustomization.emit();
  }


}


