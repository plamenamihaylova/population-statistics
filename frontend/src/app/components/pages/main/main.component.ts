import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CitiesService } from 'src/app/services/cities.service';
import ICity from 'src/app/shared/models';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  cities: ICity[] = [];
  columnsToDisplay = ['name', 'area', 'population', 'density'];

  constructor(private citiesService: CitiesService) {
    let citiesObservable: Observable<ICity[]>;
    citiesObservable = this.citiesService.getCities();
    citiesObservable.subscribe((cities) => {
      this.cities = cities;
    });
  }
}
