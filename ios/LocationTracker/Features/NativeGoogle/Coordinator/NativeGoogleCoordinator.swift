import SwiftUI
import UIKit

enum NativeGoogleCoordinator {
  @MainActor
  static func makeViewController(onClose: @escaping () -> Void) -> UIViewController {
    let viewModel = NativeGoogleViewModel()
    let view = NativeGoogleView(viewModel: viewModel, onClose: onClose)
    return UIHostingController(rootView: view)
  }
}
