import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import {FormGroup} from '@angular/forms';
import {InstallSchema} from "../shared/schemas/install";
import {VariableService} from "../shared/services/utilities/util_variable/variable.service";
import {InstallService} from "../shared/services/install/install.service";

@Component({
  selector: 'idm-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.css' ],
  encapsulation: ViewEncapsulation.None,
  providers: [InstallService]
})
export class InstallComponent implements OnInit {
  private installFormGroup: FormGroup;
  private installForm: InstallSchema = new InstallSchema();
  constructor(private http: Http, private router: Router, private webservice: InstallService, private variableService: VariableService) {
    this.createForm();
  }

  public ngOnInit() {
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
      appsadminname: this.installForm.appsadminname,
      appsadminpass: this.installForm.appsadminpass,
      postgresusername: this.installForm.postgresusername,
      postgresuserpass: this.installForm.postgresuserpass,
      postgresadminpass: this.installForm.postgresadminpass,
      sentinelip: this.installForm.sentinelip,
      vaulttreename: this.installForm.vaulttreename
    });
  }
  public  save() {
    let body = {
      vaultip: this.installForm.vaultip.value,
      boxpass: this.installForm.boxpass.value,
      vaulttreename: this.installForm.vaulttreename.value,
      vaultadminname: this.installForm.vaultadminname.value,
      vaultadminpass: this.installForm.vaultadminpass.value,
      ssopass: this.installForm.ssopass.value,
      boxusername: this.installForm.boxusername.value,
      appsadminname: this.installForm.appsadminname.value,
      appsadminpass: this.installForm.appsadminpass.value,
      postgresusername: this.installForm.postgresusername.value,
      postgresuserpass: this.installForm.postgresuserpass.value,
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
  public isFormValid() {
    let isValid: boolean = this.installFormGroup.valid && !(this.variableService.isEmptyArray(this.installForm.vaultadminname.value)) && !(this.variableService.isEmptyArray(this.installForm.appsadminname.value)) && !(this.variableService.isEmptyArray(this.installForm.vaultip.value)) && !(this.variableService.isEmptyArray(this.installForm.boxusername.value));
    return isValid;
  }
  public getData() {
    this.webservice.getDataFromBackend()
      .subscribe(
        (data) => console.log(data),
        (err) => this.logError(err),
        () => console.log('got data')
      );
  }
  public s_install() {
    this.webservice.s_install()
      .subscribe(
        (data) => {
          console.log('installation started');
        },
        (err) => this.logError(err),
        () => console.log('got data')
      );

  }
  public s_confiugre() {
    this.webservice.s_configure()
      .subscribe(
        (data) => {
          console.log('configuration started');
        },
        (err) => this.logError(err),
        () => console.log('got data')
      );

  }
  public  download() {
    this.webservice.download()
      .subscribe(
        (data) => {
          console.log('got data');
          this.copyIso();
        },
        (err) => this.logError(err),
        () => console.log('got data')
      );
  }
  public  copyIso() {
    this.webservice.copyIso()
      .subscribe(
        (data) => {
          console.log('got data');
        },
        (err) => this.logError(err),
        () => console.log('got data')
      );
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
