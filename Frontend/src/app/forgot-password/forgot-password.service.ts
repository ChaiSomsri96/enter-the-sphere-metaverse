import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private forgotUrl= environment.apiUrl + "/auth/forgot-password";

  constructor(private http : HttpClient) { }

  forgot(data){
   return this.http.post(this.forgotUrl,data)
  }
}
