import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  private marketUrl = environment.apiUrl + "/cards?limit=1000&page=1";
  private typeUrl = environment.apiUrl + "/card-type";
  private rarityUrl = environment.apiUrl + "/card-rarity"
  private accountUrl = environment.apiUrl + "/trade/get-my-account-info";

  constructor( private http : HttpClient) { }

	getCardsByUrl(url){
		return this.http.get(url).pipe(
			map ((resp: any[])=>{
				return resp.map(el=>{
					el.srcImage = el.cardImage;
					el.cardImage = `${environment.apiUrl}/cards/img?u=${encodeURIComponent(el.srcImage)}&h=500`;

					return el;
					})
				})
		);
	}

  getCards(){
    return this.getCardsByUrl(this.marketUrl);
  }

  getRarity(){
    return this.http.get(this.rarityUrl)
  }

  getTypes(){
    return this.http.get(this.typeUrl)
  }

  getCardsType(id){
    return this.getCardsByUrl(this.typeUrl + "/" + id + "/cards")
  }

  getCardsByRarity(id){
    return this.getCardsByUrl(this.rarityUrl + "/" +  id + '/cards')
  }

  accountInfo(){
    return this.http.get(this.accountUrl)
  }

}
