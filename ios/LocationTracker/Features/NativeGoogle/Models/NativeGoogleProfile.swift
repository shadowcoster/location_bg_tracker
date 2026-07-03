import Foundation

struct NativeGoogleProfile: Decodable, Equatable {
  let id: String
  let displayName: String
  let email: String

  static let placeholder = NativeGoogleProfile(
    id: "local-preview",
    displayName: "SpiderX User",
    email: "ios.native@spiderx.app"
  )
}
