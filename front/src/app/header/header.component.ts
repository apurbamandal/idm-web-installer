import {Component, Input, OnInit} from '@angular/core';
import {AppLoadingService} from "../shared/services/loading/app-loading.service";
import {Menu} from "../shared/schemas/menu-schema";
import {MenuItem} from "../shared/schemas/menu-item-schema";
import {LogoutService} from "../shared/services/logout/logout.service";

@Component({
  selector: 'idm-header',
  template: require('./header.component.html'),
  styles: [require('./header.component.css')]
})
export class HeaderComponent {

  errorMessage: string;
  profileMenu = new MenuItem();


  constructor(private appLoadingService: AppLoadingService, private logoutService: LogoutService) {
  }


  isApplicationLoading() {
    return this.appLoadingService.appLoading;
  }


  logout() {
    this.logoutService.logout();
  }
}


