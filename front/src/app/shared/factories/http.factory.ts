import {XHRBackend, Http, RequestOptions} from "@angular/http";
import {InterceptedHttp} from "../interceptors/http.interceptor";
import {Injector} from "@angular/core";
import {CookiesService} from "../services/utilities/util_cookies/cookies.service";
import {Router} from "@angular/router";

export function httpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, injector: Injector, cookiesService: CookiesService, router: Router): Http {
  return new InterceptedHttp(xhrBackend, requestOptions, injector, cookiesService, router);
}

