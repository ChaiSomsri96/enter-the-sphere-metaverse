import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CardDetailService {
  // http://34.214.14.240:3000/v1/card-history/user/5f16cb2b33e5d65e3dbecb34?sortBy=created_at:desc&limit=10&page=1
  private detailUrl = environment.apiUrl + "/cards/";
  private tradeUrl = environment.apiUrl + "/trade/";
  private accountUrl = environment.apiUrl + "/trade/get-my-account-info";
  private tradeHistoryUrl = environment.apiUrl + "/card-history/user/"
  private marketUrl = environment.apiUrl + "/cards?limit=1000&page=1";
  private cardSaleUrl = environment.apiUrl + "/sale/"

  constructor(private http: HttpClient) { }

  getDetails(id) {
    return this.http.get(this.detailUrl + id).pipe(
			map((resp: any)=>{
					resp.srcImage=resp.cardImage;
					resp.cardImage=`${environment.apiUrl}/cards/img?u=${encodeURIComponent(resp.srcImage)}&h=500`;

					return resp;
			})
		);
  }

  buy(id, data) {
    return this.http.post(this.tradeUrl + id + "/buy", data)
  }

  sale(id, data) {
    return this.http.post(this.tradeUrl + id + "/sell", data)
  }

  accountInfo() {
    return this.http.get(this.accountUrl)
  }

  getTradeHistory(id, page) {
    return this.http.get(this.tradeHistoryUrl + id + "?sortBy=" + 'created_at:desc' + "&limit=10&page=" + page)
  }

  getCardforSale(id) {
    return this.http.get(this.cardSaleUrl + id)
  }

  getCards() {
    return this.http.get(this.marketUrl)
  }

}
