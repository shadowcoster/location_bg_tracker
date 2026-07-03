import Foundation

protocol NativeGoogleServiceProtocol {
  func fetchPosts() async throws -> [PlaceholderPost]
  func fetchPost(id: Int) async throws -> PlaceholderPost
  func createPost(_ request: PlaceholderPostRequest) async throws -> PlaceholderPost
  func replacePost(id: Int, request: PlaceholderPostRequest) async throws -> PlaceholderPost
  func updatePost(id: Int, request: PlaceholderPostPatchRequest) async throws -> PlaceholderPost
  func deletePost(id: Int) async throws -> EmptyResponse
}

final class NativeGoogleService: NativeGoogleServiceProtocol {
  private let apiClient: APIClientProtocol

  init(apiClient: APIClientProtocol = APIClient()) {
    self.apiClient = apiClient
  }

  // Service is the use-case layer: ViewModel calls these clear methods, not raw URLs.
  func fetchPosts() async throws -> [PlaceholderPost] {
    try await apiClient.request(NativeGoogleEndpoint.posts, as: [PlaceholderPost].self)
  }

  func fetchPost(id: Int) async throws -> PlaceholderPost {
    try await apiClient.request(NativeGoogleEndpoint.post(id: id), as: PlaceholderPost.self)
  }

  func createPost(_ request: PlaceholderPostRequest) async throws -> PlaceholderPost {
    try await apiClient.request(NativeGoogleEndpoint.createPost(request), as: PlaceholderPost.self)
  }

  func replacePost(id: Int, request: PlaceholderPostRequest) async throws -> PlaceholderPost {
    try await apiClient.request(NativeGoogleEndpoint.replacePost(id: id, request), as: PlaceholderPost.self)
  }

  func updatePost(id: Int, request: PlaceholderPostPatchRequest) async throws -> PlaceholderPost {
    try await apiClient.request(NativeGoogleEndpoint.updatePost(id: id, request), as: PlaceholderPost.self)
  }

  func deletePost(id: Int) async throws -> EmptyResponse {
    try await apiClient.request(NativeGoogleEndpoint.deletePost(id: id), as: EmptyResponse.self)
  }
}

final class NativeGooglePreviewService: NativeGoogleServiceProtocol {
  func fetchPosts() async throws -> [PlaceholderPost] {
    [
      PlaceholderPost(userId: 1, apiId: 1, title: "Preview GET list", body: "This row is local preview data.")
    ]
  }

  func fetchPost(id: Int) async throws -> PlaceholderPost {
    PlaceholderPost(userId: 1, apiId: id, title: "Preview GET detail", body: "Detail data from preview service.")
  }

  func createPost(_ request: PlaceholderPostRequest) async throws -> PlaceholderPost {
    PlaceholderPost(userId: request.userId, apiId: 101, title: request.title, body: request.body)
  }

  func replacePost(id: Int, request: PlaceholderPostRequest) async throws -> PlaceholderPost {
    PlaceholderPost(userId: request.userId, apiId: id, title: request.title, body: request.body)
  }

  func updatePost(id: Int, request: PlaceholderPostPatchRequest) async throws -> PlaceholderPost {
    PlaceholderPost(userId: request.userId ?? 1, apiId: id, title: request.title ?? "Preview PATCH", body: request.body ?? "Updated preview body.")
  }

  func deletePost(id: Int) async throws -> EmptyResponse {
    EmptyResponse()
  }
}
