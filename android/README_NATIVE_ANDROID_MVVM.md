# Native Android MVVM API Flow

This native screen opens from React Native through `NativeGoogleScreenModule`, then launches a native `NativeGoogleActivity` configured with Jetpack Compose.

## Folder Flow

1. `bridge/NativeGoogleScreenModule.kt`
   React Native calls this module via standard bridge. It launches `NativeGoogleActivity` with a standard Android Intent.

2. `features/nativegoogle/activity/NativeGoogleActivity.kt`
   Serves as the native host Activity. It instantiates the Compose screen and injects the view model.

3. `features/nativegoogle/views/NativeGoogleScreen.kt`
   Jetpack Compose UI only. Action buttons trigger methods in the view model.

4. `features/nativegoogle/viewmodels/NativeGoogleViewModel.kt`
   State and screen logic. Owns loading states, errors, and responses using Coroutines and `MutableStateFlow`s.

5. `features/nativegoogle/services/PlaceholderService.kt`
   Uses Retrofit to declare API routes with simple annotations.

6. `core/api/APIClient.kt`
   Shared Retrofit builder configuring base URL, converters, and JSON parsing.

7. `core/api/AppEnvironment.kt`
   Environment constants like the API Base URL.

## API Methods

- `GET /posts`
- `GET /posts/1`
- `POST /posts`
- `PUT /posts/1`
- `PATCH /posts/1`
- `DELETE /posts/1`

Base URL:
`https://jsonplaceholder.typicode.com/`

## Learning Rule

Keep the UI layer (Composables) simple and decoupled. Avoid writing hardcoded request parameters or raw JSON handling inside the Compose functions. Keep the network configuration abstract inside `APIClient` and `PlaceholderService`. Add new API calls by defining new data models, registering the endpoint in `PlaceholderService`, exposing the call in `NativeGoogleViewModel`, and then connecting the trigger to Compose.
