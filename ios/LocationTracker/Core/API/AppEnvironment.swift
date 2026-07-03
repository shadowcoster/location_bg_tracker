import Foundation

enum AppEnvironment {
  static var apiBaseURL: URL {
    URL(string: "https://jsonplaceholder.typicode.com")!
  }
}
