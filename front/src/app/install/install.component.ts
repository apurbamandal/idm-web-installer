import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { WebService } from '../webservices/webservices.services';
import { AuthenticationService } from '../authentication/authentication.service';
import {getInputValues} from "@angularclass/hmr";

@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.css' ],
  encapsulation: ViewEncapsulation.None,
  providers: [WebService, AuthenticationService]
})
export class InstallComponent implements OnInit {

  @ViewChild('vaultadminname') input:ElementRef;
  constructor(private http: Http, private router: Router, private webservice: WebService) { }

  public ngOnInit() {
    this.webservice.isAuthenticated();
  }

  public  save() {
    console.log("saved");
    let body = {
      a: "admin",
      b: "asd"
    };
    this.webservice.save(body)
      .subscribe((data) => {
          console.log('got data');
        },
        (err) => this.logError(err),
        () => console.log('got data'));
  }

  private logError(err: Response) {
    console.log('There was an error: ' + err.status);
    if (err.status === 0) {
      console.error('Seems server is down');
    }
    if (err.status === 401) {
      this.router.navigate(['/sessionexpired']);
    }
  }

}
