import {Injectable, Injector} from "@angular/core";
import {ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {AppAuthenticationService} from "../services/authentication/app-authentication.service";
import {HeaderConstants} from "../constants/header-constants";
import {CookiesService} from "../services/utilities/util_cookies/cookies.service";
import {Router} from "@angular/router";

@Injectable()
export class InterceptedHttp extends Http {

  replayRequestURL: string | Request;
  replayRequestOptionsArgs: RequestOptionsArgs;
  authenticationInProgress: boolean = false;

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private injector: Injector, private cookiesService: CookiesService, private route: Router ) {
    super(backend, defaultOptions);
  }

  request(url: any): Observable<Response> {
     let optionss =this.getRequestOptionArgs(url);
    return super.request(url ).catch(this.catchErrors(url));
  }

  authenticatedRequest(url: string | Request) {
    // let emitter;
    // let loginFinishedObservable: Observable<number> = new Observable(e => {
    //   emitter = e;
    // });
    // let loginFinishedCallback = (url, options) => {
    //   this.replayRequestURL = url;
    //   this.replayRequestOptionsArgs = options;
    //   this.authenticationInProgress = false;
    //   emitter.next();
    // };
    // let loginFrameAddedCallback = () => {
    //   this.authenticationInProgress = true;
    // };
     this.injector.get(Router).navigateByUrl('login');
    // // return loginFinishedObservable.flatMap(() => {
    //   console.log(this.getRequestOptionArgs(this.replayRequestOptionsArgs))
    //   return this.request(this.replayRequestURL, this.getRequestOptionArgs(this.replayRequestOptionsArgs));
    // // });


  }

  private catchErrors(url: string | Request) {
    return (response: Response) => {
      if (response.status === 401) {
         this.authenticatedRequest(url);
      }
      return Observable.throw(response);
    };
  }

  private getRequestOptionArgs(url:any): RequestOptionsArgs {
    if (!url.headers) {
      url.headers = new Headers();
    }
    // let myHeaders = new Headers();
    // myHeaders.append('Content-Type', 'application/json');
    //
    let spiffyCookie = this.cookiesService.getCookie('SessionToken');
    if (spiffyCookie != undefined) {
      let spiffyComponents = spiffyCookie.split(',');
      url.headers.set(HeaderConstants.authorization, spiffyComponents[0] + ' ' + spiffyComponents[1]);
    }

    // if (this.replayRequestURL) (<Request>this.replayRequestURL).headers = options.headers;

    return url;
  }

}
