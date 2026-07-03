import Foundation

/// Body model for POST and PUT. Required fields make full-create/full-replace explicit.
struct PlaceholderPostRequest: Encodable, Equatable {
  let userId: Int
  let title: String
  let body: String
}

/// Body model for PATCH. Optional fields mean "send only what changed".
struct PlaceholderPostPatchRequest: Encodable, Equatable {
  let title: String?
  let body: String?
  let userId: Int?
}
