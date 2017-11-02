import {Component} from '@angular/core';
import {AppLoadingService} from "../shared/services/loading/app-loading.service";
import {EmitterService} from "../shared/services/emitter/emitter.service";
import {Http} from "@angular/http";

@Component({
  selector: 'idm-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent {


  constructor(private appLoadingService: AppLoadingService, private emitterService: EmitterService, private http: Http) {

  }

  isApplicationLoading() {
    return this.appLoadingService.appLoading;
  }

  test() {
    this.http.get('/idmtools/api/protected').subscribe(res => {
      console.log(res);
    });
  }

}
