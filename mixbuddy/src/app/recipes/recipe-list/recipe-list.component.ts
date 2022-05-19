import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe',
      'This is simply a test.',
      'https://cdn.diffords.com/contrib/stock-images/2020/03/5e6276c0d9942.jpg'
    ),
    new Recipe(
      'Another Test Recipe',
      'This is simply another test.',
      'https://bakeitwithlove.com/wp-content/uploads/2021/10/Blue-Hawaiian-Cocktail-sq-500x500.jpg'
    ),
  ];

  constructor() {}

  ngOnInit(): void {}

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }
}
