export interface TableRows  {
   rowId:string;
  [propName: string]: any;
  
}

export class EmitSelectedRows{
   selectedRows:TableRows[];
   actionName:string;
}
export class EmitClickedElement{
   selectedRows:TableRows;
   actionName:string;
}
