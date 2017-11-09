import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import {FormGroup} from '@angular/forms';
import {InstallSchema} from "../shared/schemas/install";
import {VariableService} from "../shared/services/utilities/util_variable/variable.service";
import {InstallService} from "../shared/services/install/install.service";
import { Observable } from 'rxjs/Observable';
declare var jQuery: any;

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
  body:any;
  data:string;
  showm:boolean=false;
  regex = /((?:2|1)\d{3}(?:-|\/)(?:(?:0[1-9])|(?:1[0-2]))(?:-|\/)(?:(?:0[1-9])|(?:[1-2][0-9])|(?:3[0-1]))(?:T|\s)(?:(?:[0-1][0-9])|(?:2[0-3])):(?:[0-5][0-9]):(?:[0-5][0-9]))(\+)((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9])?(?:\s?(?:am|AM|pm|PM))?)(\s+)(.)/igm;
  regex2=/,/igm;
  regex3=/\r/igm;
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
      vaulttreename: this.installForm.vaulttreename,
      buildid: this.installForm.buildid
    });
  }

  public saveProperties(body) {
    this.webservice.saveProperties(body)
      .subscribe((data) => {
          this.install(this.body);
          console.log('got data');
        },
        (err) => this.logError(err));
  }

  public  save() {
    this.body = {
      vaultip: this.installForm.vaultip.value,
      boxpass: this.installForm.boxpass.value,
      vaulttreename: this.installForm.vaulttreename.value,
      vaultadminname: this.installForm.vaultadminname.value,
      vaultadminpass: this.installForm.vaultadminpass.value||'novell',
      ssopass: this.installForm.ssopass.value||'novell',
      boxusername: this.installForm.boxusername.value,
      appsadminname: this.installForm.appsadminname.value||'novell',
      appsadminpass: this.installForm.appsadminpass.value||'novell',
      postgresusername: this.installForm.postgresusername.value||'idmadmin',
      postgresuserpass: this.installForm.postgresuserpass.value||'novell',
      sentinelip: this.installForm.sentinelip.value||'127.0.0.1',
      buildid: this.installForm.buildid.value||'lastSuccessfulBuild'
    };
    console.log(this.body.buildid);
    this.webservice.save(this.body)
      .subscribe((data) => {
          this.copysilent(this.body);
          console.log('got data');
          this.showLogs(this.body);
        },
        (err) => this.logError(err));
  }

  public copysilent(body) {
    this.webservice.copyRequiredFiles(body)
      .subscribe(
        (data) => {
          this.saveProperties(this.body);
          console.log('files copied');
        },
        (err) => this.logError(err),
        () => console.log('got data')
      );
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

  public install(body) {
    this.webservice.install(body)
      .subscribe(
        (data) => {
         // this.displayLog(data);
        }
      );

  }

  public showLogs(body) {
    this.webservice.showLogs(body)
      .subscribe(
        (data) => {
         this.displayLog(data);
        }
      );

  }

  public scroll(){
    setTimeout(function(){ jQuery('#log').animate({
      scrollTop: jQuery('#log')[0].scrollHeight}, 200); }, 1000);
  }

  public copyIso() {
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

  public showModal(){

    jQuery('#RoleQuickInfo').modal('show');
    this.scroll();
  }

  public displayLog(data){

    jQuery('#RoleQuickInfo').modal('show');
    let result = data.json().toString();
    this.data=result.replace(this.regex3, '\n');;
    // result = result.replace(this.regex, '');
    // this.data = result.replace(this.regex2, '');
    this.scroll();
  }
}
