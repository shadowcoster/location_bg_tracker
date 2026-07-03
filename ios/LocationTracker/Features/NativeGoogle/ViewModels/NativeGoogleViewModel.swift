import Foundation

@MainActor
final class NativeGoogleViewModel: ObservableObject {
  @Published private(set) var posts: [PlaceholderPost] = []
  @Published private(set) var selectedPost: PlaceholderPost?
  @Published private(set) var createdPost: PlaceholderPost?
  @Published private(set) var replacedPost: PlaceholderPost?
  @Published private(set) var patchedPost: PlaceholderPost?
  @Published private(set) var deleteMessage: String?
  @Published private(set) var lastAction = "Ready"
  @Published private(set) var isLoading = false
  @Published var errorMessage: String?

  private let service: NativeGoogleServiceProtocol

  init(service: NativeGoogleServiceProtocol = NativeGoogleService()) {
    self.service = service
  }

  func load() {
    guard !isLoading else { return }

    Task {
      await perform("GET /posts + GET /posts/1") {
        // Flow: View -> ViewModel.load() -> Service.fetchPosts() -> Endpoint.posts -> APIClient.
        self.posts = try await self.service.fetchPosts()
        self.selectedPost = try await self.service.fetchPost(id: 1)
      }
    }
  }

  func runGetExamples() {
    Task {
      await perform("GET examples") {
        self.posts = try await self.service.fetchPosts()
        self.selectedPost = try await self.service.fetchPost(id: 1)
      }
    }
  }

  func runPostExample() {
    Task {
      await perform("POST /posts") {
        self.createdPost = try await self.service.createPost(
          PlaceholderPostRequest(
            userId: 1,
            title: "Created from native iOS",
            body: "POST sends a new resource body to the server."
          )
        )
      }
    }
  }

  func runPutExample() {
    Task {
      await perform("PUT /posts/1") {
        self.replacedPost = try await self.service.replacePost(
          id: 1,
          request: PlaceholderPostRequest(
            userId: 1,
            title: "Fully replaced from SwiftUI",
            body: "PUT replaces the complete resource representation."
          )
        )
      }
    }
  }

  func runPatchExample() {
    Task {
      await perform("PATCH /posts/1") {
        self.patchedPost = try await self.service.updatePost(
          id: 1,
          request: PlaceholderPostPatchRequest(
            title: "Partially updated title",
            body: nil,
            userId: nil
          )
        )
      }
    }
  }

  func runDeleteExample() {
    Task {
      await perform("DELETE /posts/1") {
        _ = try await self.service.deletePost(id: 1)
        self.deleteMessage = "DELETE /posts/1 succeeded. JSONPlaceholder returns an empty object."
      }
    }
  }

  func runAllExamples() {
    Task {
      await perform("Running all API examples") {
        self.posts = try await self.service.fetchPosts()
        self.selectedPost = try await self.service.fetchPost(id: 1)
        self.createdPost = try await self.service.createPost(
          PlaceholderPostRequest(userId: 1, title: "Native POST", body: "Created by MVVM flow.")
        )
        self.replacedPost = try await self.service.replacePost(
          id: 1,
          request: PlaceholderPostRequest(userId: 1, title: "Native PUT", body: "Replaced by MVVM flow.")
        )
        self.patchedPost = try await self.service.updatePost(
          id: 1,
          request: PlaceholderPostPatchRequest(title: "Native PATCH", body: nil, userId: nil)
        )
        _ = try await self.service.deletePost(id: 1)
        self.deleteMessage = "All methods completed: GET, POST, PUT, PATCH, DELETE."
      }
    }
  }

  private func perform(_ action: String, operation: @escaping () async throws -> Void) async {
    guard !isLoading else { return }

    isLoading = true
    errorMessage = nil
    lastAction = action

    do {
      try await operation()
    } catch {
      errorMessage = error.localizedDescription
    }

    isLoading = false
  }
}
