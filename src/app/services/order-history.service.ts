import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) { }

  getOrderHistory(theEmail: string):Observable<GetReponseOrderHistory> {
    const orderUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;
    console.log(`orderHistoryURL=${orderUrl}`);
    return this.http.get<GetReponseOrderHistory>(orderUrl);
  } 
}

interface GetReponseOrderHistory { 
  _embedded: {
    orders: OrderHistory[];
  }

}