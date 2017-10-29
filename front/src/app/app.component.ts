import { Component } from '@angular/core';
import { AppLoadingService } from "./shared/services/loading/app-loading.service";
import { TranslateService } from "@ngx-translate/core";
declare var jQuery: any;

@Component({
  selector: 'idm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loggedInUserDetails: Object = {};
  errorMessage: string;


  constructor( private appLoadingService: AppLoadingService, translate: TranslateService) {
    //set this variable to true to show spinner and a load all the important modules and then set it to false
    this.appLoadingService.appLoading = true;
    ///important modules goes here
    this.appLoadingService.appLoading = false;

    //Translate service set default language  ** and the language  to use
    translate.setDefaultLang('en');
    translate.use('en');
  }

  isApplicationLoading() {
    return this.appLoadingService.appLoading;
  }

}
