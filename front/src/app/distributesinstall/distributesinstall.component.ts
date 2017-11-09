import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import {FormGroup} from '@angular/forms';
import {InstallSchema} from "../shared/schemas/install";
import {VariableService} from "../shared/services/utilities/util_variable/variable.service";
import {InstallService} from "../shared/services/install/install.service";

@Component({
  selector: 'idm-distributesinstall',
  templateUrl: './distributesinstall.component.html',
  styleUrls: ['./distributesinstall.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [InstallService]
})
export class DistributesinstallComponent implements OnInit {
  private installFormGroup: FormGroup;
  private installForm: InstallSchema = new InstallSchema();
  body:any;
  constructor(private http: Http, private router: Router, private webservice: InstallService, private variableService: VariableService) {
    this.createForm();
  }

  ngOnInit() {
    this.webservice.loginCheck().subscribe(res => console.log(res));
  }
  public createForm() {
    this.installFormGroup = new FormGroup({
      vaultip: this.installForm.vaultip,
      boxusername: this.installForm.boxusername,
      boxpass: this.installForm.boxpass,
      vaultadminname: this.installForm.vaultadminname,
      vaultadminpass: this.installForm.vaultadminpass,
      ssopass: this.installForm.ssopass,
      appsip: this.installForm.appsip,
      boxappsusername: this.installForm.boxappsusername,
      boxappspass: this.installForm.boxappspass,
      appsadminname: this.installForm.appsadminname,
      appsadminpass: this.installForm.appsadminpass,
      postgresusername: this.installForm.postgresusername,
      postgresuserpass: this.installForm.postgresuserpass,
      postgresadminpass: this.installForm.postgresadminpass,
      sentinelip: this.installForm.sentinelip,
      vaulttreename: this.installForm.vaulttreename,
      buildid: this.installForm.buildid
    });
  }
  public  save() {
    this.body = {
      vaultip: this.installForm.vaultip.value,
      boxpass: this.installForm.boxpass.value,
      vaulttreename: this.installForm.vaulttreename.value,
      vaultadminname: this.installForm.vaultadminname.value,
      vaultadminpass: this.installForm.vaultadminpass.value||'novell',
      ssopass: this.installForm.ssopass.value||'novell',
      appsip: this.installForm.appsip.value,
      boxappsusername: this.installForm.boxappsusername.value,
      boxappspass: this.installForm.boxappspass.value,
      boxusername: this.installForm.boxusername.value,
      appsadminname: this.installForm.appsadminname.value||'novell',
      appsadminpass: this.installForm.appsadminpass.value||'novell',
      postgresusername: this.installForm.postgresusername.value||'idmadmin',
      postgresuserpass: this.installForm.postgresuserpass.value||'novell',
      sentinelip: this.installForm.sentinelip.value||'127.0.0.1',
      buildid: this.installForm.buildid.value||'lastSuccessfulBuild'
    };
    console.log(this.body.buildid);
    this.webservice.save_distributed(this.body)
      .subscribe((data) => {
          this.copysilent_vault(this.body);
          console.log('got data');
        },
        (err) => this.logError(err));
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
    let isValid: boolean = this.installFormGroup.valid && !(this.variableService.isEmptyArray(this.installForm.vaultadminname.value)) && !(this.variableService.isEmptyArray(this.installForm.appsadminname.value)) && !(this.variableService.isEmptyArray(this.installForm.vaultip.value)) && !(this.variableService.isEmptyArray(this.installForm.boxusername.value)) && !(this.variableService.isEmptyArray(this.installForm.boxappsusername.value)) && !(this.variableService.isEmptyArray(this.installForm.boxappspass.value));
    return isValid;
  }

  private saveProperties_apps(body: any) {
    this.webservice.saveProperties_apps(body)
      .subscribe((data) => {
          this.install_apps(this.body);
          console.log('got data');
        },
        (err) => this.logError(err));
  }
  private saveProperties_vault(body: any) {
    this.webservice.saveProperties_vault(body)
      .subscribe((data) => {
          this.install_vault(this.body);
          console.log('got data');
        },
        (err) => this.logError(err));
  }

  public copysilent_apps(body) {
    this.webservice.copyRequiredFiles_apps(body)
      .subscribe(
        (data) => {
          this.saveProperties_apps(this.body);
          console.log('files copied');
        },
        (err) => this.logError(err),
        () => console.log('got data')
      );
  }
  public copysilent_vault(body) {
    this.webservice.copyRequiredFiles_vault(body)
      .subscribe(
        (data) => {
          this.saveProperties_vault(this.body);
          console.log('files copied');
        },
        (err) => this.logError(err),
        () => console.log('got data')
      );
  }

  public install_vault(body) {
    this.webservice.install_vault(body)
      .subscribe(
        (data) => {
          this.copysilent_apps(this.body);
          console.log('files copied');
        },
        (err) => this.logError(err),
        () => console.log('got data')
      );
  }
  public install_apps(body) {
    this.webservice.install_apps(body)
      .subscribe(
        (data) => {
          //this.saveProperties_apps(this.body);
          console.log('files copied');
        },
        (err) => this.logError(err),
        () => console.log('got data')
      );
  }
}
