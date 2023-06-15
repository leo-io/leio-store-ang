import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries'
  private statesUrl = 'http://localhost:8080/api/states'


  constructor(private httpClient: HttpClient) { }


  getCountries() {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(map((response => response._embedded.countries)))
  }
//const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      

  getStates(theCountryCode: string): Observable<State[]> {
    return this.httpClient.get<GetResponseStates>(`${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`, {
      params: {
        country: theCountryCode
      }
    }).pipe(map((response => response._embedded.states)))
  }

  //return a Observable array 
  getCreditCardMonths(startMonth: number): Observable<number[]>{
    let data: number[] = [];
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data); //the of operator returns wraps the array as 
                    //observable
  }

  getCreditCardYears(): Observable<number[]> { 
    let data: number[] = [];

    for (let theYear = 2023; theYear <= 2032; theYear++) {
      data.push(theYear);
    }

    return of(data); //the of operator returns wraps the array as 
                    //observable
  }
 
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
