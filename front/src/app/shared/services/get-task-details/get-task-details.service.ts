import {Injectable} from '@angular/core';
import {AppContextService} from "../context/app-context.service";
import {Http, Response, Headers, URLSearchParams, RequestOptions} from '@angular/http';
import {Context} from "../../schemas/app-context-schema";
import {Observable} from "rxjs/Rx";
import {PathConstats} from "../../constants/path-constants";
import {handleError} from "../../factories/handle-error.factory";
import {TableConfigObject} from "../../schemas/table-config-schema";


@Injectable()
export class GetTaskDetails {
  appContext: Context;

  constructor(private http: Http, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: Response) {
    let body = res.json();

    return body || {};
  }

  getTasks(tableConfigObject: TableConfigObject): Observable<any> {
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let myParams = new URLSearchParams();
    myParams.append('fromIndex', tableConfigObject.tableData.nextIndex.toString());
    myParams.append('size', tableConfigObject.tableData.pageSize.toString());
    myParams.append('q', '*');
    myParams.append('sortOrder', tableConfigObject.tableData.sortOrder);
    myParams.append('sortBy', tableConfigObject.tableData.sortBy);
    myParams.append('assignedTo', 'assignedTo');
    myParams.append('recipient', 'recipientAsMe');
    myParams.append('expireUnit', 'weeks');
    myParams.append('expireWithin', '');
    myParams.append('proxyUser', '');
    myParams.append('status', '');
    let options = new RequestOptions({headers: myHeaders, params: myParams});
    return this.http.get(this.appContext.context + PathConstats.restAccess + PathConstats.taskListApi, options)
      .map(this.extractData)
      .catch(handleError);
  }

  getColumnCustomization(columnCustomizationApi): Observable<any> {
    return this.http.get(this.appContext.context + PathConstats.restAccess + columnCustomizationApi, {})
      .map(this.extractData)
      .catch(handleError);
  }


}
