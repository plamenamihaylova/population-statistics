import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ICity from '../shared/models';
import { BASE_URL, DENSITY_URL, FILTER_URL, SORT_URL } from '../shared/constants/urls';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  constructor(private http: HttpClient) { }

  getAllCities(): Observable<ICity[]> {
    return this.http.get<ICity[]>(BASE_URL)
  }

  getCitiesDensity(): Observable<ICity[]>{
    return this.http.get<ICity[]>(DENSITY_URL)
  }

  getSortedCities(property: string, order: string): Observable<ICity[]>{
    return this.http.get<ICity[]>(SORT_URL + property + '/' + order)
  }

  getFilteredCities(term: string): Observable<ICity[]> {
    return this.http.get<ICity[]>(FILTER_URL + term)
  }

  // // not sure if I have to implement it
  // addNewCity(): Observable<ICity[]> {
  //   return this.http.get<ICity[]>(BASE_URL)
  // }
}
