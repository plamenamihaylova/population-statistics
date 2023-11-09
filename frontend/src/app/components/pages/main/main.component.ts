import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CitiesService } from 'src/app/services/cities.service';
import ICity from 'src/app/shared/models';
import {
  validateSortOrder,
  validateSortProperty,
} from 'src/app/utils/validate.params';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  cities: ICity[] = [];

  constructor(
    private citiesService: CitiesService,
    activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    let citiesObservable: Observable<ICity[]>;
    activatedRoute.params.subscribe((params) => {
      if (params['property'] && params['order']) {
        const { property, order } = params;
        if (validateSortProperty(property) && validateSortOrder(order)) {
          citiesObservable = this.citiesService.getSortedCities(property,order);
        } else this.router.navigateByUrl('/not-found');
      } else if (params['term']) {
        const { term } = params;
        citiesObservable = this.citiesService.getFilteredCities(term);
      } else {
        citiesObservable = this.citiesService.getAllCities();
      }
      citiesObservable.subscribe((cities) => {
        this.cities = cities;
      });
    });
  }
}
