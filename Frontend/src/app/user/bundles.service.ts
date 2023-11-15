import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthenticationService } from "../shared/services/auth.service";

import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class BundlesService {

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  getAllCards(){
    return this.http.get(`${environment.apiUrl}/bundles/users/${this.auth.userValue.uuid}?opened=false`);
  }

  getAllOpenedCards(){
    return this.http.get(`${environment.apiUrl}/bundles/users/${this.auth.userValue.uuid}?opened=true`);
  }

  getbundledCards(id){
    return this.http.get(`${environment.apiUrl}/bundles/${id}/cards`);
  }

 openBundles(id){
    return this.http.get(`${environment.apiUrl}/bundles/${id}/open`, {withCredentials: true}).pipe(map((resp: any[])=>{
			return resp.map(el=>{
				el.srcImage = el.cardImage;
				el.cardImage = `${environment.apiUrl}/cards/img?u=${encodeURIComponent(el.srcImage)}&h=500`;

				return el;
		});
		}));
  }


  giftBundle(id, senderId, email){
    return this.http.post(`${environment.apiUrl}/bundles/${id}/gift`, {
      id,
      senderId,
      email
    })
  }
}
