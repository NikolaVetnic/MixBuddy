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
    // take 1 value from observable and unsubscribe
    // exhaustMap waits for the first observable (user) to complete
    // entire observable chain then switches to the HTTP observable
    return this.authService.user.pipe(
      take(1),

      exhaustMap((user) => {
        return this.httpClient.get<Recipe[]>(
          'https://mixbuddy-cdb00-default-rtdb.firebaseio.com/recipes.json',
          {
            params: new HttpParams().set('auth', user.token),
          }
        );
      }),

      map((recipes) => {
        // first map - rxjs operator, second map - JS array method
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),

      tap((recipes) => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
