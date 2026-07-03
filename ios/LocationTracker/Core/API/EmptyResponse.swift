import Foundation

/// Use this for endpoints that return `{}` or no useful response body, like DELETE.
struct EmptyResponse: Decodable, Equatable {}
