import { Component, OnInit, Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication';
import { Router } from '@angular/router';


import { Http, Response } from '@angular/http';
import {jsonHeader} from "../utils/headers/xhrheaders";

@Injectable()
export class WebService {

  constructor(private authService: AuthenticationService) { }

  public getDataFromBackend() {
    return this.authService.getResource('/api/protected');
  }

  public install() {
    return this.authService.postResource({}, '/api/install');
  }
  public download() {
    return this.authService.postResource({}, '/api/download');
  }
  public copyIso() {
    return this.authService.postResource({}, '/api/copyIso');
  }

  public s_install() {
    return this.authService.postResource({}, '/api/s_install');
  }

  public s_configure() {
    return this.authService.postResource({}, '/api/s_configure');
  }
  public save(body: object) {
    return this.authService.postResource(body, '/api/save');
  }

  public isAuthenticated() {
    if (!this.authService.isAuthenticated()) {
      this.authService.clearUserDataAndRedirect();
    }
  }
}
