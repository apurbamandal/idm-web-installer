import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { WebService } from '../webservices/webservices.services';

@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.css']
})
export class InstallComponent implements OnInit {

  constructor(private http: Http, private router: Router, private webservice: WebService) { }

  public ngOnInit() {
    this.webservice.isAuthenticated();
  }

}
