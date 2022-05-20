import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from './recipe.model';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(value: Recipe[], search: string): Recipe[] {
    if (value) {
      const regexp = new RegExp(search, 'i');
      const properties = Object.keys(value[0]);
      return [
        ...value.filter((item) => {
          return properties.some((property) => regexp.test(item[property]));
        }),
      ];
    }
  }
}
