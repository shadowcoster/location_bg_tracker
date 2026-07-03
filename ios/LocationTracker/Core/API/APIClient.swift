import Foundation

protocol APIClientProtocol {
  func request<T: Decodable>(_ endpoint: APIEndpoint, as type: T.Type) async throws -> T
}

final class APIClient: APIClientProtocol {
  private let baseURL: URL
  private let session: URLSession
  private let decoder: JSONDecoder

  init(
    baseURL: URL = AppEnvironment.apiBaseURL,
    session: URLSession = .shared,
    decoder: JSONDecoder = JSONDecoder()
  ) {
    self.baseURL = baseURL
    self.session = session
    self.decoder = decoder
    self.decoder.keyDecodingStrategy = .convertFromSnakeCase
  }

  func request<T: Decodable>(_ endpoint: APIEndpoint, as type: T.Type) async throws -> T {
    // Flow step 1: ViewModel asks a Service for data. Service creates an Endpoint.
    // Flow step 2: APIClient converts that Endpoint into URLRequest and executes it.
    let request = try makeRequest(for: endpoint)

    do {
      let (data, response) = try await session.data(for: request)
      guard let httpResponse = response as? HTTPURLResponse else {
        throw APIError.invalidResponse
      }

      guard (200...299).contains(httpResponse.statusCode) else {
        throw APIError.httpStatus(httpResponse.statusCode)
      }

      do {
        return try decoder.decode(T.self, from: data)
      } catch {
        throw APIError.decodingFailed(error)
      }
    } catch let error as APIError {
      throw error
    } catch {
      throw APIError.underlying(error)
    }
  }

  private func makeRequest(for endpoint: APIEndpoint) throws -> URLRequest {
    // One shared request builder keeps headers, base URL, timeout, and query handling consistent.
    guard var components = URLComponents(
      url: baseURL.appendingPathComponent(endpoint.path),
      resolvingAgainstBaseURL: false
    ) else {
      throw APIError.invalidURL
    }

    components.queryItems = endpoint.queryItems.isEmpty ? nil : endpoint.queryItems

    guard let url = components.url else {
      throw APIError.invalidURL
    }

    var request = URLRequest(url: url)
    request.httpMethod = endpoint.method.rawValue
    request.httpBody = endpoint.body
    request.timeoutInterval = 20
    request.setValue("application/json", forHTTPHeaderField: "Accept")

    if endpoint.body != nil {
      request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    }

    endpoint.headers.forEach { key, value in
      request.setValue(value, forHTTPHeaderField: key)
    }

    return request
  }
}
