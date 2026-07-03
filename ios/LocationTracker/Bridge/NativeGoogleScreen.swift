import React
import UIKit

@objc(NativeGoogleScreen)
final class NativeGoogleScreen: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    true
  }

  @objc(open:rejecter:)
  func open(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      guard let presenter = TopViewControllerProvider.current() else {
        reject("NO_PRESENTER", "Unable to find a view controller to present from.", nil)
        return
      }

      var navigationController: UINavigationController?
      let viewController = NativeGoogleCoordinator.makeViewController {
        navigationController?.dismiss(animated: true)
      }

      navigationController = UINavigationController(rootViewController: viewController)
      navigationController?.modalPresentationStyle = .fullScreen

      guard let navigationController else {
        reject("NO_NAVIGATION", "Unable to create native navigation controller.", nil)
        return
      }

      presenter.present(navigationController, animated: true) {
        resolve(nil)
      }
    }
  }
}
