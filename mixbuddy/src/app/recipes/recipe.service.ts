import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shoppint-list.service';

import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe',
      'This is simply a test.',
      'https://cdn.diffords.com/contrib/stock-images/2020/03/5e6276c0d9942.jpg',
      [new Ingredient('Vodka', 1), new Ingredient('Cherries', 5)]
    ),
    new Recipe(
      'Another Test Recipe',
      'This is simply another test.',
      'https://bakeitwithlove.com/wp-content/uploads/2021/10/Blue-Hawaiian-Cocktail-sq-500x500.jpg',
      [new Ingredient('Schnaps', 1), new Ingredient('Apples', 3)]
    ),
  ];

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    // returns a new array which is a copy of the one stored here
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }
}
