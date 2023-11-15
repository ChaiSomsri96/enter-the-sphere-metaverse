import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthenticationService } from "../shared/services/auth.service";
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class UserCardsService {

  constructor(private http: HttpClient, private auth: AuthenticationService){

  }

  getUserCards() {
    return this.http.post(`${environment.apiUrl}/cards/card`, {
      userId: this.auth.userValue.uuid
    }).pipe(
			map((resp: any[])=>{
				return resp.map(el=>{
					el.srcImage = el.cardImage;
					el.cardImage = `${environment.apiUrl}/cards/img?u=${encodeURIComponent(el.srcImage)}&h=500`;

					return el;
				})	
			})
		);
  }

	sellCard(tokenId, sellprice) {
		return this.http.post(`${environment.apiUrl}/cards/sell`,{
			userId: this.auth.userValue.uuid,
			tokenId,
			sellprice,
		});
	}

	withdrawCard(tokenId, destination) {
		return this.http.post(`${environment.apiUrl}/cards/transfer`,{
			userId: this.auth.userValue.uuid,
			tokenId,
			destination,
		});
	}

  addCardForListing(cardId){
    return this.http.post(`${environment.apiUrl}/marketing-listing`, {
      userId: this.auth.userValue.uuid,
      cardId
    })
  }

  getUserWallet(){
    return this.http.get(`${environment.apiUrl}/wallets/safe-wallet/users/${this.auth.userValue.uuid}`);
  }


	linkDeckApp() {
		document.location.href=`https://deck.enter-the-sphere.com/?id=${this.auth.userValue.telegramId}`;
	}

		getUserWalletBalance(){
			return this.http.post(`${environment.apiUrl}/wallets/safe-wallet/balance`,{});
		}


		withdrawBCH(dest){
			return this.http.post(`${environment.apiUrl}/wallets/safe-wallet/withdrawal`,{dest});
		}

}
