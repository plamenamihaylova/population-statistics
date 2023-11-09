import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ICity from '../shared/models';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  constructor(private http: HttpClient) { }

  getCities(): Observable<ICity[]> {
    return this.http.get<ICity[]>(BASE_URL)
  }
}
