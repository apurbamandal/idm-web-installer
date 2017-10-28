import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { WebService } from '../webservices/webservices.services';
import { AuthenticationService } from '../authentication/authentication.service';
import {getInputValues} from "@angularclass/hmr";
import {BrowserModule} from '@angular/platform-browser';
import {FormArray, FormControl, FormGroup, FormsModule, Validators} from '@angular/forms';
import {InstallSchema} from '../utils/headers/schema/install';
import {VariableService} from "../utils/services/variable.service";

@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.css' ],
  encapsulation: ViewEncapsulation.None,
  providers: [WebService, AuthenticationService]
})
export class InstallComponent implements OnInit {


  private installFormGroup: FormGroup;
  private installForm: InstallSchema = new InstallSchema();

  constructor(private http: Http, private router: Router, private webservice: WebService, private variableService: VariableService) {
    this.createForm();
  }

  public ngOnInit() {

    this.webservice.isAuthenticated();
  }

  public createForm() {
    this.installFormGroup = new FormGroup({
      vaultadminname: this.installForm.vaultadminname,
      vaultadminpass: this.installForm.vaultadminpass,
      appsadminname: this.installForm.appsadminname,
      appsip: this.installForm.appsip,
      vaultip: this.installForm.vaultip,
      ssopass: this.installForm.ssopass
    });
  }

  public  save() {
    let body = {
      vaultip: this.installForm.vaultip.value,
      boxpass: this.installForm.boxpass.value,
      vaultadminname: this.installForm.vaultadminname.value,
      vaultadminpass: this.installForm.vaultadminpass.value,
      ssopass: this.installForm.ssopass.value,
      appsadminname: this.installForm.appsadminname.value,
      appsadminpass: this.installForm.appsadminpass.value,
      postgresusername: this.installForm.postgresusername.value,
      postgresuserpass: this.installForm.postgresuserpass.value,
      postgresadminpass: this.installForm.postgresadminpass.value,
      sentinelip: this.installForm.sentinelip.value
    };
    console.log(this.installForm.vaultadminname.value)
    this.webservice.save(body)
      .subscribe((data) => {
          console.log('got data');
        },
        (err) => this.logError(err),
        () => console.log('got data'));
  }

  public save2() {
    // console.log(val.value);
    console.log(this.installForm);
    console.log(this.installForm.appsadminname)
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

  public isFormValid() {
    let isValid: boolean = this.installFormGroup.valid && !(this.variableService.isEmptyArray(this.installForm.vaultadminname.value)) && !(this.variableService.isEmptyArray(this.installForm.appsadminname.value)) && !(this.variableService.isEmptyArray(this.installForm.vaultip.value));
    return isValid;
  }

}
