import { Injectable } from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class LoginService {
  constructor(private http:Http  ) { }

  public login(req: object) {
    return this.http.post( '/idmtools/api/login', req )
      .map(this.extractToken);
  }
  private extractToken(res: any ) {
    let body = res.json();
    if (res.status === 200) {
      // let response = 'response';
      // let tokenString = 'jwt';
      // let token = body[tokenString];
       // TODO: Decode token and get expiry time from here, someone has to implement this. :(
      // let expiry = new Date(body['exp']);
      // let maxTokenExpiryTime = expiry.getTime();
      // let SessionToken = 'Bearer,' + token ;
      // let expiryes = String(maxTokenExpiryTime);
      // this.cookies.setCookie('SessionToken', SessionToken , '/');
     // this.cookies.setCookie('expiry', expiryes , '/');
      return body;
    }
  }
}
