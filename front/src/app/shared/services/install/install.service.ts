import {Injectable} from '@angular/core';
import {Http} from "@angular/http";

@Injectable()
export class InstallService {

  constructor(private  http: Http) {
  }

  public getDataFromBackend() {
    return this.http.get('/idmtools/api/protected');
  }

  public loginCheck() {
    return this.http.get('/idmtools/api/loginCheck');
  }



  public install(body: any) {
    return this.http.post('/idmtools/api/install_standalone', body);
  }
  public install_vault(body: any) {
    return this.http.post('/idmtools/api/install_vault', body);
  }

  public install_apps(body: any) {
    return this.http.post('/idmtools/api/install_apps', body);
  }

  public copyIso() {
    return this.http.post('/idmtools/api/copyIso', {});
  }

  public copyRequiredFiles_vault(body: any) {
    return this.http.post('/idmtools/api/copyRequiredFiles_vault', body);
  }
  public copyRequiredFiles_apps(body: any) {
    return this.http.post('/idmtools/api/copyRequiredFiles_apps', body);
  }


  public copyRequiredFiles(body: any) {
    return this.http.post('/idmtools/api/copyRequiredFiles',body);
  }
  public saveProperties(body: any) {
    return this.http.post('/idmtools/api/saveProperties', body);
  }
  public saveProperties_apps(body: any) {
    return this.http.post('/idmtools/api/saveProperties_apps', body);
  }

  public saveProperties_vault(body: any) {
    return this.http.post('/idmtools/api/saveProperties_vault', body);
  }
  public save(body: any) {
    return this.http.post('/idmtools/api/save', body);
  }
  public save_distributed(body: any) {
    return this.http.post('/idmtools/api/save_distributed', body);
  }
}
