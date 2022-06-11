import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private recipeService: RecipeService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();

    this.httpClient
      .put(
        'https://mixbuddy-cdb00-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.authService.user.pipe(
      take(1), // take 1 value from observable and unsubscribe

      exhaustMap((user) => {
        // exhaustMap waits for the first observable (user) to complete
        return this.httpClient.get<Recipe[]>(
          'https://mixbuddy-cdb00-default-rtdb.firebaseio.com/recipes.json',
          {
            params: new HttpParams().set('auth', user.token),
          }
        );
      }),

      // entire observable chain then switches to the HTTP observable
      map((recipes) => {
        // first map - rxjs operator, second map - JS array method
        return recipes.map((recipe) => {
          return {
            ...recipe,
            // add ingredients array to recipe in case there is none
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),

      // executes some code in place without altering the data funneled through the observable
      tap((recipes) => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
