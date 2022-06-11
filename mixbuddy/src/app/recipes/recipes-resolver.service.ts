import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';

import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

/*
 * A resolver is a piece of code which runs before a route is load-
 * ed to ensure the data that the route depends on is there.
 */
@Injectable({
  providedIn: 'root',
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private recipeService: RecipeService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this.recipeService.getRecipes();

    // fetch only if there are none at the moment
    if (recipes.length == 0) {
      /*
       * Not subscribing here because the resolver will do that for us to
       * find out when the data is there.
       */
      return this.dataStorageService.fetchRecipes();
    } else {
      return recipes;
    }
  }
}
