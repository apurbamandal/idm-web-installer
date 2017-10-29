import {Injectable} from '@angular/core';
import {BaseRequestOptions, RequestOptions, RequestOptionsArgs} from "@angular/http";
import {HeaderConstants} from "../../../constants/header-constants";
import {CookiesService} from "../util_cookies/cookies.service";

@Injectable()
export class DefaultRequestOptionsService extends BaseRequestOptions {

  constructor(private cookieService: CookiesService) {
    super();
  }

  merge(options?: RequestOptionsArgs): RequestOptions {
    var newOptions = super.merge(options);
    newOptions.headers.set('Content-Type', 'application/json');
    newOptions.headers.set(HeaderConstants.cacheControl, HeaderConstants.noCacheNoStoreMustRevalidate);
    newOptions.headers.set(HeaderConstants.pragma, HeaderConstants.noCache);
    newOptions.headers.set(HeaderConstants.expires, HeaderConstants.zero);
    newOptions.headers.set(HeaderConstants.refresh, HeaderConstants.daySeconds);
    newOptions.headers.set("sample", "sample");

    let headerValue = this.cookieService.getCookie(HeaderConstants.headerName);
    if (headerValue != null) {
      newOptions.headers.set(HeaderConstants.headerName, headerValue);
    }
    let spiffyCookie = this.cookieService.getCookie('Spiffy_Session');
    if (spiffyCookie != undefined) {
      let spiffyComponents = spiffyCookie.split(',');
      newOptions.headers.set(HeaderConstants.authorization, spiffyComponents[0] + ' ' + spiffyComponents[1]);
    }
    return newOptions;
  }
}
