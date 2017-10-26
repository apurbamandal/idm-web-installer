import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { WebService } from '../webservices/webservices.services';
import { AuthenticationService } from '../authentication/authentication.service';
import {getInputValues} from "@angularclass/hmr";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { InstallSchema } from '../utils/headers/schema/install';

@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.css' ],
  encapsulation: ViewEncapsulation.None,
  providers: [WebService, AuthenticationService]
})
export class InstallComponent implements OnInit {

  @ViewChild('vaultadminname') input:ElementRef;
  public vaultadminpass=" adaddadad ";
   installForm : InstallSchema;
  constructor(private http: Http, private router: Router, private webservice: WebService) {
    this.installForm = new InstallSchema();
    console.log(this.installForm);
  }

  public ngOnInit() {
    this.webservice.isAuthenticated();
  }

  public  save() {

    console.log(this.vaultadminpass);
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

  public  save2() {
    // console.log(val.value);
    console.log(this.installForm);
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
