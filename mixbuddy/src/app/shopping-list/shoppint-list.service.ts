import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
  /*
   * Subject is a special type of Observable that allows values to be
   * multicasted to many Observers. The subjects are observers as we-
   * ll because they can subscribe to another observable and get val-
   * ue from it, which it will multicast to all of its subscribers.
   */
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Vodka', 10),
  ];

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    // Subjects use next to send (emit) a new value
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    // for (let ingredient of ingredients) this.addIngredient(ingredient);

    // this.ingredients.push(...ingredients);
    // this.ingredientsChanged.next(this.ingredients.slice());

    let checkedIngredients = ingredients.slice();

    for (let i0 of this.ingredients) {
      for (let i1 of checkedIngredients) {
        if (i0.name === i1.name) {
          i0.amount += i1.amount;
          checkedIngredients.splice(checkedIngredients.indexOf(i1), 1);
        }
      }
    }

    this.ingredients.push(...checkedIngredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
