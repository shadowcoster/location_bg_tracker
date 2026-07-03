import Foundation

protocol APIEndpoint {
  var path: String { get }
  var method: HTTPMethod { get }
  var headers: [String: String] { get }
  var queryItems: [URLQueryItem] { get }
  var body: Data? { get }
}

extension APIEndpoint {
  var headers: [String: String] {
    [:]
  }

  var queryItems: [URLQueryItem] {
    []
  }

  var body: Data? {
    nil
  }
}

enum HTTPMethod: String {
  case get = "GET"
  case post = "POST"
  case put = "PUT"
  case patch = "PATCH"
  case delete = "DELETE"
}
