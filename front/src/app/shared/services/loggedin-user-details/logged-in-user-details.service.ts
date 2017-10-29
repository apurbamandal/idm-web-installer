import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Http, Response} from "@angular/http";
import {PathConstats} from "../../constants/path-constants";
import {AppContextService} from "../context/app-context.service";
import {Context} from "../../schemas/app-context-schema";
import {handleError} from "../../factories/handle-error.factory";

@Injectable()
export class LoggedInUserDetailsService {

  appContext: Context;
  constructor(private http: Http, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  getDetails(): Observable<any> {
    return this.http.get(this.appContext.context+PathConstats.loggedInUserDetailsApi)
      .map(this.extractData)
      .catch(handleError);
  }

}
