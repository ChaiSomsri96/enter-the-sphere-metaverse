import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private registerUrl = environment.apiUrl + "/auth/register";

  constructor(private http : HttpClient) { }

  register(data){
    return this.http.post(this.registerUrl,data)
  }
}
