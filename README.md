# MixBuddy

A frontend Angular app for keeping tabs on cocktail recipes.

MixBuddy app is intended for input and storage of cocktail recipes, as well as creating shopping lists based on the selected recipe. Functionalities include:

-   user login & registration,
-   recipe input and storage (manual save and fetch from the backend),
-   recipe search bar,
-   shopping list based on the selected recipe.

Check out [live demo here](https://mixbuddy-cdb00.web.app/).

## Notes

Added _Bootstrap_ by adding `"node_modules/bootstrap/dist/css/bootstrap.min.css"` into `styles` array of `angular.json` file.

To introduce components into the project there must a `@Component` decorator (alongside `templateUrl` and `selector` fields), as well as add the component to the `app.module.ts` file. This is done automatically with `ng g c path/component_name` _CLI_ command.

Emitters work in such a way that `@Output()` decoration enables whatever is emitted to be listened to from other components. The type that `EventEmitter` is parametrized with is the type of argument that will be emitted. The component that listens to the emitter has the selector of the component which creates the emitter, and also said selector has something like this: `(emitter_name)="funcName($event)`, where `$event` always refers to event data.

In order to deploy, it is first necessary to **use & check environment variables**. Firebase API key should be added to `environment.prod.ts` and `environment.ts` (the key will then be referred to as `environment.firebaseAPIKey`, it's necessary to import environments as well):

```
  firebaseAPIKey: 'AIzaSyCgLt3EwGsdE7tKjiTzdpQ7DQle4yC_Gek',
```

Then the project is transpiled by using `ng build --prod`, after which the assets are placed into `/dist` directory. Then the Firebase CLI needs to be installed with `npm i -g firebase-tool`, followed by `firebase login` to login to Firebase, and finally `firebase init` while in the `/dist` directory (picking the proper options, `public` directory is the `/dist` directory, configure as a single-page app, do not overwrite existing `index.html` file).
