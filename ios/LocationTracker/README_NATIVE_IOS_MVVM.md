# Native iOS MVVM API Flow

This native screen opens from React Native through `NativeGoogleScreen`, then presents a SwiftUI screen.

## Folder Flow

1. `Bridge/NativeGoogleScreen.swift`
   React Native calls this module. It finds the top iOS controller and presents a native `UINavigationController`.

2. `Features/NativeGoogle/Coordinator/NativeGoogleCoordinator.swift`
   Creates the SwiftUI view and injects the view model.

3. `Features/NativeGoogle/Views/NativeGoogleView.swift`
   UI only. Buttons call view model methods like `runGetExamples()` and `runPostExample()`.

4. `Features/NativeGoogle/ViewModels/NativeGoogleViewModel.swift`
   State and screen logic. It owns loading, errors, and response data.

5. `Features/NativeGoogle/Services/NativeGoogleService.swift`
   Use-case layer. It exposes readable methods: `fetchPosts`, `createPost`, `replacePost`, `updatePost`, `deletePost`.

6. `Features/NativeGoogle/Services/NativeGoogleEndpoint.swift`
   URL path, HTTP method, and body for every API call.

7. `Core/API/APIClient.swift`
   Shared networking. It builds `URLRequest`, hits the API, validates status code, and decodes JSON.

## API Methods Added

- `GET /posts`
- `GET /posts/1`
- `POST /posts`
- `PUT /posts/1`
- `PATCH /posts/1`
- `DELETE /posts/1`

Base URL is configured in `Core/API/AppEnvironment.swift`:

```swift
https://jsonplaceholder.typicode.com
```

## Learning Rule

Keep the View simple. Do not put URLs or JSON parsing in SwiftUI. Add new APIs by creating a typed model, adding a case in `NativeGoogleEndpoint`, exposing a method in `NativeGoogleService`, then calling that method from the ViewModel.
