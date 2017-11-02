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

  public install() {
    return this.http.post('/idmtools/api/install', {});
  }

  public download(body: any) {
    return this.http.post('/idmtools/api/download', body);
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
  public copysilent(body: any) {
    return this.http.post('/idmtools/api/copysilent',body);
  }
  public saveProperties(body: any) {
    return this.http.post('/idmtools/api/saveProperties', body);
  }
  public save(body: any) {
    return this.http.post('/idmtools/api/save', body);
  }
}