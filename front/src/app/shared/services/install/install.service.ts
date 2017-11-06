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

  public copyIso() {
    return this.http.post('/idmtools/api/copyIso', {});
  }

  public s_install() {
    return this.http.post('/idmtools/api/s_install', {});
  }

  public s_configure() {
    return this.http.post('/idmtools/api/s_configure', {});
  }
  public copyRequiredFiles(body: any) {
    return this.http.post('/idmtools/api/copyRequiredFiles',body);
  }
  public saveProperties(body: any) {
    return this.http.post('/idmtools/api/saveProperties', body);
  }
  public save(body: any) {
    return this.http.post('/idmtools/api/save', body);
  }
}
