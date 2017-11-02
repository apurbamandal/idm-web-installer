import {Injectable} from '@angular/core';
import {LocationStrategy} from '@angular/common';

import {AppContextService} from "../context/app-context.service";
import {WindowRefService} from "../utilities/util_winRef/window-ref.service";
import {CookiesService} from "../utilities/util_cookies/cookies.service";


@Injectable()
export class LogoutService {

  constructor(private location: LocationStrategy, private appContext: AppContextService, private winRef: WindowRefService, private cookieService: CookiesService) {
  }

  logout() {
    //let url = this.appContext.getAppContext().logout + "?target=" + (<any>this.location)._platformLocation.location.href;
    this.cookieService.deleteCookie('SessionToken');
    // this.cookieService.deleteCookie('netiq_idm_rbpm_acsrf');
    this.winRef.nativeWindow.location.href = '';
  }
}
