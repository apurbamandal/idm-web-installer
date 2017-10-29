import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs";

import {Context} from "../../schemas/app-context-schema";
import {ServerContext} from "../../schemas/server-context-schema";

@Injectable()
export class AppContextService {

  private appContext: Context;

  constructor(private http: Http) {
    this.appContext = new Context();
  }

  public getAppContext(): Context {
    return this.appContext;
  }

  public load() {
    
  }

}
