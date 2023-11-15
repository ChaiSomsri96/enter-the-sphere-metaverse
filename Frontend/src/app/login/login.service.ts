import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = environment.apiUrl + "/auth/login";

  constructor(private http : HttpClient) { }

  login(data){
    return this.http.post(this.loginUrl,data)
  }

}
