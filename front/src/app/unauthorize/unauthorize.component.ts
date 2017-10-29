import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { CanActivateViaAuthGuardService } from "../shared/services/guards/can-activate-via-auth-guard.service";
import { EmitterService } from "../shared/services/emitter/emitter.service";
import { Router } from "@angular/router";
declare var jQuery: any;
@Component({
  selector: 'idm-unauthorize',
  templateUrl: './unauthorize.component.html',
  styleUrls: ['./unauthorize.component.css']
})
export class UnauthorizeComponent implements AfterViewInit {


  authorizeAccess: any;
  authorizeAccessToPage: string;

  constructor(private EmitterService: EmitterService, private router: Router) {
    this.eventListner();
  }

  ngAfterViewInit() {

    // console.log(this.showmessageDiaglog.activateUnauthorizeMessage);
  }

  eventListner() {
    this.authorizeAccess = this.EmitterService.get("authorizeAccess");
    this.authorizeAccess.subscribe((res) => {
      this.authorizeAccessToPage = res;
      jQuery("#activateUnauthorizeMessage").modal('show');

    });
  }

  redirect() {

    if (this.router.routerState.snapshot.url == "/role" || this.router.routerState.snapshot.url == "/resource" || this.router.routerState.snapshot.url == "/") {

      this.router.navigate[this.router.routerState.snapshot.url];

    }
    else {

      window.location.href = '/idmdash/#/dashboard';
    }
    // console.log(this.router.routerState);
    //window.location.href = '/idmdash/#/dashboard'
  }
}
