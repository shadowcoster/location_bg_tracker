import Foundation

enum NativeGoogleEndpoint: APIEndpoint {
  case posts
  case post(id: Int)
  case createPost(PlaceholderPostRequest)
  case replacePost(id: Int, PlaceholderPostRequest)
  case updatePost(id: Int, PlaceholderPostPatchRequest)
  case deletePost(id: Int)

  var path: String {
    switch self {
    case .posts, .createPost:
      return "posts"
    case .post(let id), .replacePost(let id, _), .updatePost(let id, _), .deletePost(let id):
      return "posts/\(id)"
    }
  }

  var method: HTTPMethod {
    switch self {
    case .posts, .post:
      return .get
    case .createPost:
      return .post
    case .replacePost:
      return .put
    case .updatePost:
      return .patch
    case .deletePost:
      return .delete
    }
  }

  var body: Data? {
    // Endpoints own request-body encoding, so the Service stays focused on use cases.
    let encoder = JSONEncoder()

    switch self {
    case .createPost(let request), .replacePost(_, let request):
      return try? encoder.encode(request)
    case .updatePost(_, let request):
      return try? encoder.encode(request)
    case .posts, .post, .deletePost:
      return nil
    }
  }
}
