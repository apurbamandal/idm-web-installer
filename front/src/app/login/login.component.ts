import {Component, OnInit} from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import {UserComponent} from "../shared/schemas/user-component";
import {LoginService} from "./login.service";
import {Router} from "@angular/router";
import {CookiesService} from "../shared/services/utilities/util_cookies/cookies.service";

@Component({
  selector: 'idm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  public inputLogo = 'assets/img/angularclass-logo.png';
  public model: UserComponent = new UserComponent(1, '', '');
  public logintext: string = 'Sign in to continue to the portal';
  public color: string = 'black';
  public myForm: FormGroup;
  public forgotPassword: boolean = false;

  constructor(private _service: LoginService, private router: Router, private cookies: CookiesService) {
    let group: any = {};
    group.username = new FormControl('', Validators.required);
    group.password = new FormControl('', Validators.required);
    group.type = new FormControl('login');
    this.myForm = new FormGroup(group);
  }

  public ngOnInit() {
    console.log('Login in...');
    if (this.cookies.getCookie('SessionToken')) {
      this.router.navigateByUrl('install');
    }
  }
  public loginUser() {

    let body = {
      username: this.myForm.controls['username'].value,
      password: this.myForm.controls['password'].value
    };
    this._service.login(body)
      .subscribe((data) => {
          let response = 'response';
          let tokenString = 'jwt';
          let token = data[tokenString];
          //TODO: Decode token and get expiry time from here, someone has to implement this. :(
          let expiry = new Date(data['exp']);
          let maxTokenExpiryTime = expiry.getTime();
          let SessionToken = 'Bearer,' + token;
          let expiryes = String(maxTokenExpiryTime);
          this.cookies.setCookie('SessionToken', SessionToken, '/');
          this.router.navigate(['install']);
        },
        (error) => {
          let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
          console.error(errMsg); // log to console instead
          this.color = 'red';
          this.logintext = errMsg;
        }
      );
  }
}
