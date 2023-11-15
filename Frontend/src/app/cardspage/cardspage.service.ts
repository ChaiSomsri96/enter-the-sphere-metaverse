import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CardspageService {

  private getAllCardsUrl = environment.apiUrl + "/cards?limit=1000&page=1";
  private searchUrl = environment.apiUrl+ "/cards";
  private typeUrl = environment.apiUrl+ "/card-type";
  private rarityUrl = environment.apiUrl + "/card-rarity"
  private accountUrl = environment.apiUrl + "/trade/get-my-account-info";

  constructor( private http : HttpClient) { }


  getCards(){
    return this.http.get(this.getAllCardsUrl, {withCredentials: true}).pipe( 
						map ((resp: any[])=>{
									return resp.map(el=>{
										el.srcImage = el.cardImage;
										el.cardImage = `${environment.apiUrl}/cards/img?u=${encodeURIComponent(el.srcImage)}&h=500`;

										return el;
									})
								})
						);
  }

  getTypes(){
    return this.http.get(this.typeUrl)
  }

  getRarity(){
    return this.http.get(this.rarityUrl)
  }

  getCardsType(id){
    return this.http.get(this.typeUrl + `/${id}/cards`)
  }

  getCardsByRarity(id){
    return this.http.get(this.rarityUrl + `/${id}/cards`)
  }

  search(name){
    return this.http.get(this.searchUrl + `?name=${name}&limit=100&page=1`)
  }

  accountInfo(){
    return this.http.get(this.accountUrl)
  }

}
