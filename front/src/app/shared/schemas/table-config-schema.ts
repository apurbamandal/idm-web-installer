import { TableRowSchema, ColumnCustomizationSchema } from "./table-row-schema";

class multiSelect {
  btnName:string;
  btnId:string;
}

export class TableConfigObject{
  columnCustomData:ColumnCustomizationSchema;
  tableData:TableRowSchema;
  multiSelectButtons: multiSelect[];
}
