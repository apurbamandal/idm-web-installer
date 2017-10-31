
import {TableRows} from "./table-rows";
export class TableRowSchema {
  sortBy:string;
  sortOrder:string;
  total : number;
  hasMore : boolean;
  rows :TableRows[];
  totalSize : any;
  nextIndex :number;
  currentPage : number;
  showingStart : number;
  pageSize : number;
  showingEnd : number;
  userTypeInTask : boolean;
  request:TableRows[];
  roleLevel:any;
  categoryKeys:any;
  query:string;
  setPageSize : boolean;
}

 
 export class column{
   column:string;
   isclickable:boolean;
   isSortable:boolean;
   displayLabel:string;
 }
export class ColumnCustomizationSchema{
   columns: column[];
 }

 