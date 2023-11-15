import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private UserAddress = new BehaviorSubject<any[]>([]);
  getUserId: Observable<any>;

  constructor(private http: HttpClient) {
    this.getUserId = this.UserAddress.asObservable();
}

setUserId(data) {
    this.UserAddress.next(data);
  }
}