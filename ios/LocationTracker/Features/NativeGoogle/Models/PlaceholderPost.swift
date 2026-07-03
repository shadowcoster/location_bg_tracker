import Foundation

/// Response model for JSONPlaceholder `/posts`.
/// `apiId` maps from JSON key `id`; `id` is a stable SwiftUI identity.
struct PlaceholderPost: Codable, Identifiable, Equatable {
  let userId: Int?
  let apiId: Int?
  let title: String
  let body: String

  var id: Int {
    apiId ?? -1
  }

  enum CodingKeys: String, CodingKey {
    case userId
    case apiId = "id"
    case title
    case body
  }
}
