import {Component, OnInit, Input, Inject, forwardRef} from '@angular/core';
import {Table} from "../../widgets/table/table";

@Component({
  selector: 'idm-ui-display',
  templateUrl: 'ui-display.component.html',
  styleUrls: ['ui-display.component.css']
})
export class UiDisplayComponent implements OnInit {
  @Input('uiData') uiData;
  @Input('rowData') rowData: any;
  @Input('columnHeader') columnHeader: string;
  @Input('isClickable') isClickable: boolean;
  @Input('rowNumber') rowNumber: number;
  displayData: string;
  displayComplexData: any;
  showComplexData = false;
  refreshModelData: boolean;
  modalData = [];

  constructor(@Inject(forwardRef(() => Table)) private _parent: Table) {
    this.displayComplexData = [];
    // this.refreshModelData = false;
  }

  ngOnInit() {
    // console.log( this.isClickable);
    this.isolateData();
  }

  isolateData() {
    if (typeof this.uiData === 'object') {
      this.showComplexData = true;
      if (Object.prototype.toString.call(this.uiData) === '[object Array]') {
        //console.log(this.uiData);
        this.uiData.forEach(element => {
          if ('name' in element) {
            this.displayComplexData.push(element.name);
            return;
          }
          else if ('displayName' in element) {
            this.displayComplexData.push(element.displayName);
            return;
          }
          else if ('id' in element) {
            this.displayComplexData.push(element.id);
            return;
          }
          else if ('ID' in element) {
            this.displayComplexData.push(element.ID);
            return;
          }
        });

      } else {

      }
      //console.log(temp);
    }
    else if (typeof this.uiData === 'string') {

      this.displayData = this.uiData;
    }

  }

  simpleClickHandler() {
    this._parent.elementClickHandler(this.rowData, this.columnHeader);
  }

  complexClickHandler(element) {
    this._parent.elementClickHandler(element, this.columnHeader);
  }

  changeModalData(data) {
    this.refreshModelData = true;
    //this.refreshModelData = true;
    // console.log("refreshModalData : "+this.refreshModelData);
    // setTimeout(() => function () {
    //   this.refreshModelData = true;
    //   console.log("refreshModalData : "+this.refreshModelData);
    // }, 10);
    // // this.refreshModelData = true;
    this.modalData = data;
    console.log(this.modalData);
  }


}
