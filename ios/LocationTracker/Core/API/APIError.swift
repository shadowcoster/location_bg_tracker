import Foundation

enum APIError: LocalizedError {
  case invalidURL
  case invalidResponse
  case httpStatus(Int)
  case decodingFailed(Error)
  case underlying(Error)

  var errorDescription: String? {
    switch self {
    case .invalidURL:
      return "The API URL is invalid."
    case .invalidResponse:
      return "The server returned an invalid response."
    case .httpStatus(let statusCode):
      return "The server returned status code \(statusCode)."
    case .decodingFailed(let error):
      return "Failed to decode the response: \(error.localizedDescription)"
    case .underlying(let error):
      return error.localizedDescription
    }
  }
}
