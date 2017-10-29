import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { Http, Response } from "@angular/http";
import { Context } from "../../schemas/app-context-schema";
import { AppContextService } from "../context/app-context.service";
import { PathConstats } from "../../constants/path-constants";
import { handleError } from "../../factories/handle-error.factory";
import { Locale, Locales } from "../../schemas/locale-schema";

@Injectable()
export class LocaleService {

  appContext: Context;
  private supportedLocalesSubject = new ReplaySubject<Locales>(1);
  supportedLocales$: Observable<Locales> = this.supportedLocalesSubject.asObservable();

  private userLocaleSubject = new ReplaySubject<string[]>(1);
  userLocale$: Observable<String[]> = this.userLocaleSubject.asObservable();
  
  private defaultLocaleSubject = new ReplaySubject<string[]>(1);
  defaultLocale$: Observable<String[]> = this.defaultLocaleSubject.asObservable();

  constructor(private http: Http, private appContextService: AppContextService) {
    this.appContext = this.appContextService.getAppContext();
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  getSupportedLocales(): Observable<Locales> {
    return this.supportedLocales$;
  }

  getUserLocale(): Observable<string[]> {
    return this.userLocale$;
  }

  getDefaultLocale(): Observable<string[]> {
    return this.defaultLocale$;
  }

  takeUpdate() {
    this.http.get(this.appContext.context + PathConstats.supportedLocalesApi, {})
      .map(this.extractData)
      .catch(handleError)
      .subscribe(res => this.supportedLocalesSubject.next(res));

    this.http.get(this.appContext.context + PathConstats.userLocaleApi, {})
      .map(this.extractData)
      .catch(handleError)
      .subscribe(res => this.userLocaleSubject.next(res));

    this.http.get(this.appContext.context + PathConstats.defaultLocaleApi, {})
      .map(this.extractData)
      .catch(handleError)
      .subscribe(res => this.defaultLocaleSubject.next(res));
    
  }

}