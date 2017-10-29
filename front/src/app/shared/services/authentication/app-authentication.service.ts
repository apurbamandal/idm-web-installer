import { Injectable } from '@angular/core';
import { Request, RequestOptionsArgs } from '@angular/http';
import { AppContextService } from "../context/app-context.service";
import { PathConstats } from "../../constants/path-constants";
import { WindowRefService } from "../utilities/util_winRef/window-ref.service";
import { DocumentRefService } from "../utilities/util_docRef/document-ref.service";
import { CookiesService } from "../utilities/util_cookies/cookies.service";
import {Router} from "@angular/router";

type finishedLoginCallbackType = (Request, RequestOptionsArgs) => any;
type loginFrameAddedCallbackType = () => any;

@Injectable()
export class AppAuthenticationService {

  finishedLoginCallback: finishedLoginCallbackType;
  loginFrameAddedCallback: loginFrameAddedCallbackType;
  replayRequestURL: string | Request;
  replayRequestOptionsArgs: RequestOptionsArgs;
  authenticationInProgress: boolean;
  authInvalidResponse: boolean = false;

  failedRequestFinishedLoginCallbacks: finishedLoginCallbackType[] = [];
  failedRequestFinishedLoginCallbacksParameter1: (string | Request)[] = [];
  failedRequestFinishedLoginCallbacksParameter2: RequestOptionsArgs[] = [];

  constructor(
    private appContext: AppContextService,
    private windowRefService: WindowRefService,
    private documentRefService: DocumentRefService,
    private cookies: CookiesService,
    private route:Router
  ) {
  }

  getContext() {
    return this.appContext.getAppContext().context;
  }

  getAuthServerAuthorizeUrl() {
    return this.appContext.getAppContext().authorize;
  }

  getAuthserverLogoutUrl() {
    return this.appContext.getAppContext().logout;
  }

  getRRAClientId() {
    return this.appContext.getAppContext().rraClientId;
  }

  getRRARedirectUrl() {
    return this.appContext.getAppContext().rraRedirectUrl;
  }

  getResponseType() {
    return 'token';
  }

  getRestAccessURL() {
    this.appContext.getAppContext().context + PathConstats.restAccess;
  }

  getRestCatalogURL() {
    this.appContext.getAppContext().context + PathConstats.restCatalog;
  }

  getAuthIframeUrl() {
    return this.getAuthServerAuthorizeUrl() + "?redirect_uri=" + this.getRRARedirectUrl() + "&client_id=" + this.getRRAClientId() + "&response_type=" + this.getResponseType();
  }

  startAuthentication(finishedLoginCallback: finishedLoginCallbackType, loginFrameAddedCallback: loginFrameAddedCallbackType, authenticationInProgress, replayRequestURL, replayRequestOptionsArgs) {
    // this.finishedLoginCallback = finishedLoginCallback;
    // this.replayRequestURL = replayRequestURL;
    // this.replayRequestOptionsArgs = replayRequestOptionsArgs;
    // this.authenticationInProgress = authenticationInProgress;
    if (!this.authenticationInProgress || this.authInvalidResponse) {
      this.loginFrameAddedCallback = loginFrameAddedCallback;
      this.route.navigate(['login']);
      // if (!this.authInvalidResponse) {
      //   this.failedRequestFinishedLoginCallbacks.length = 0;
      //   this.failedRequestFinishedLoginCallbacksParameter1.length = 0;
      //   this.failedRequestFinishedLoginCallbacksParameter2.length = 0;
      // }

      // this.windowRefService.nativeWindow.addEventListener('message', this.authenticationComplete, false);
      // let oauthframe = this.documentRefService.nativeDocument.createElement("IFRAME");
      // oauthframe.setAttribute('id', 'oauthframe');
      // oauthframe.setAttribute('seamless', 'true');
      // oauthframe.setAttribute('class', 'level-max');
      // oauthframe.setAttribute('src', this.getAuthIframeUrl());
      // oauthframe.setAttribute('style', 'position: fixed;left: 0px;top: 0px;width: 100%;height: 100%;z-index: 5000;');
      // this.documentRefService.nativeDocument.body.appendChild(oauthframe);
      // this.loginFrameAddedCallback();

    }
    // this.failedRequestFinishedLoginCallbacks.push((a, b) => finishedLoginCallback(a, b));
    // this.failedRequestFinishedLoginCallbacksParameter1.push(replayRequestURL);
    // this.failedRequestFinishedLoginCallbacksParameter2.push(replayRequestOptionsArgs);
  }

  login(){
    this.route.navigate(['login']);
  }

  authenticationComplete = (response) => {
    let oauthframe = this.documentRefService.nativeDocument.getElementById("oauthframe");
    if (oauthframe != null) oauthframe.parentNode.removeChild(oauthframe);
    var params = {};
    if (response != undefined && response != null && typeof response != "string") {
      if (response.data != undefined && response.data != null && typeof response.data == "string") {
        response = response.data;
      }
    }
    if (response != undefined && response != null && typeof response == "string") {
      var queryString = response.substring(1);
      var regex = /([^&=]+)=([^&]*)/g;
      var m = regex.exec(queryString);
      while (m) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        m = regex.exec(queryString);
      }
      this.cookies.setCookie('Spiffy_Session', params['token_type'] + "," + params['access_token'], '/');
      for (let i = 0; i < this.failedRequestFinishedLoginCallbacks.length; ++i) {
        let param1 = this.failedRequestFinishedLoginCallbacksParameter1[i];
        let param2 = this.failedRequestFinishedLoginCallbacksParameter2[i];
        this.failedRequestFinishedLoginCallbacks[i](param1, param2);
      }
      this.authInvalidResponse = false;
      this.failedRequestFinishedLoginCallbacks.length = 0;
      this.failedRequestFinishedLoginCallbacksParameter1.length = 0;
      this.failedRequestFinishedLoginCallbacksParameter2.length = 0;
    } else {
      this.authInvalidResponse = true;
      this.startAuthentication(this.finishedLoginCallback, this.loginFrameAddedCallback, this.authenticationInProgress, this.replayRequestURL, this.replayRequestOptionsArgs);
    }
  }
}
