import UIKit

enum TopViewControllerProvider {
  static func current(
    from rootViewController: UIViewController? = UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap { $0.windows }
      .first { $0.isKeyWindow }?
      .rootViewController
  ) -> UIViewController? {
    if let navigationController = rootViewController as? UINavigationController {
      return current(from: navigationController.visibleViewController)
    }

    if let tabBarController = rootViewController as? UITabBarController {
      return current(from: tabBarController.selectedViewController)
    }

    if let presentedViewController = rootViewController?.presentedViewController {
      return current(from: presentedViewController)
    }

    return rootViewController
  }
}
