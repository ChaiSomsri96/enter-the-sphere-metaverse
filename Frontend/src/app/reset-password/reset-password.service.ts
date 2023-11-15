import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private resetUrl= environment.apiUrl + "/auth/reset-password?token="

  constructor(private http : HttpClient) { }

  // reset(data){
  //   return this.http.post(this.resetUrl,data)
  // }
}
