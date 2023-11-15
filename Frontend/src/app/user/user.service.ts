import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {

  constructor(private http: HttpClient){

  }

  getUser(id) {
    return this.http.get(`${environment.apiUrl}/users/${id}`)
  }

  updateUser(id, data) {
    return this.http.patch(`${environment.apiUrl}/users/${id}`, data)
  }

  getUserWallet(id){
    return this.http.get(`${environment.apiUrl}/wallets/safe-wallet/users/${id}`, {responseType: 'text'})
  }


  getUserProfilePic(id) {
    return this.http.get(`https://api.telegram.org/1778058125:AAGym4NDua1PZIXT0eyTwJSelAhEWB1H9ns/UserProfilePhotos?user_id=${id}`)
  }

		connectTelegram(loginData){
			return this.http.post(`${environment.apiUrl}/auth/telegram/connect`,loginData)
		}

}
